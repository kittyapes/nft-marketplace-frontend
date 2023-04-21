import type { OfferModel } from '$interfaces';
import axios from 'axios';
import { BigNumber, type Signer } from 'ethers';
import { getApiUrl } from '.';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { formatToken } from '$utils/misc/priceUtils';
import { getKnownTokenDetails } from '$utils/misc/priceUtils';
import { getOfferSignature } from '$utils/contracts/offers';
import {
	ErrNotificationError,
	HandledError,
	generateRandomNonce,
	getSecondsSinceEpoch,
	parseFullId,
} from '$utils';
import { defaultOfferDuration } from '$constants';
import { ensureAmountWeiApproved, hasEnoughWeiBalance } from '$utils/contracts/token';
import { getContract } from '$utils/misc/getContract';

interface GetOffers_ResponseData {
	error: boolean;
	data: OfferModel[];
}

export async function apiGetOffers(
	page: number,
	limit: number,
	nftFullId: string,
): Promise<OfferModel[]> {
	if (page === 3) {
		limit = 0;
	}
	// TODO offer of current user has to be filtered somehow, so it can be displayed at the top

	const res = await axios.get<GetOffers_ResponseData>(
		getApiUrl(null, '/nfts/' + nftFullId + '/offers'),
		{
			params: { page, limit },
		},
	);

	return res.data.data;
}

export async function apiSubmitOffer(buyer: Signer, nftFullId: string, offerAmount: BigNumber) {
	const tokenTicker = 'WETH';
	const tokenAddress = getKnownTokenDetails({ ticker: tokenTicker }).address;

	const buyerAddress = await buyer.getAddress();

	const hasEnoughBalance = await hasEnoughWeiBalance(tokenAddress, buyerAddress, offerAmount);

	if (!hasEnoughBalance) {
		throw new ErrNotificationError('Offer amount is higher that your current balance.');
	}

	// Get marketplace V2 contract
	const marketplaceContract_v2 = getContract('marketplace-v2');

	// Set token allowance
	const approvalSuccessful = await ensureAmountWeiApproved(
		marketplaceContract_v2.address,
		offerAmount,
		tokenAddress,
	);

	if (!approvalSuccessful) {
		throw new HandledError(
			'Offer could not be created because user did not approve required token amount.',
		);
	}

	const { collectionAddress, tokenId } = parseFullId(nftFullId);
	const expireTime = getSecondsSinceEpoch() + defaultOfferDuration;
	const nonce = generateRandomNonce();
	const tokenAmount = BigNumber.from(1);

	const signature = await getOfferSignature(
		buyer,
		collectionAddress,
		tokenId,
		tokenAmount,
		tokenAddress,
		offerAmount,
		expireTime,
		nonce,
	);

	await axios.post(
		getApiUrl(null, '/nfts/offer'),
		{
			tokenId: tokenId.toString(),
			collectionAddress,
			offerPrice: offerAmount.toString(),
			formatOfferPrice: formatToken(offerAmount, tokenAddress),
			signature,
			paymentTokenTicker: 'WETH',
			paymentTokenAddress: tokenAddress,
			expireTime,
			nonce: nonce.toString(),
			tokenAmount: tokenAmount.toString(),
		},
		await getAxiosConfig(),
	);

	return null;
}

export async function apiCancelOffer(userAddress: string) {
	return new Promise((resolve) => setTimeout(resolve, 3000));
}
