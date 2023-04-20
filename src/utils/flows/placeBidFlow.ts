import { profileData, refreshProfileData } from '$stores/user';
import { appSigner } from '$stores/wallet';
import {
	ErrNotificationError,
	handleAxiosNetworkError,
	HandledError,
	handleErrActionRejected,
} from '$utils';
import { getApiUrl } from '$utils/api';
import type { Listing } from '$utils/api/listing';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import contractCaller from '$utils/contracts/contractCaller';
import { ensureAmountApproved } from '$utils/contracts/token';
import { getContract } from '$utils/misc/getContract';
import { formatToken } from '$utils/misc/priceUtils';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import { ethers, BigNumber, type BigNumberish } from 'ethers';
import { get } from 'svelte/store';

async function placeBidNormal(listing: Listing, amount: BigNumber): Promise<void> {
	const contract = getContract('marketplace');

	await ensureAmountApproved(contract.address, amount.toString(), listing.paymentTokenAddress);

	const callArgs = [listing.listingId, amount];

	try {
		await contractCaller(contract, 'bid', 150, 1, ...callArgs);
	} catch (err) {
		if (err.message.includes('ALREADY_HIGHEST_BIDDER')) {
			throw new ErrNotificationError('You are already the highest bidder', err);
		}

		notifyError(err.message);
	}
}

const GASLESS_BID_TYPES = {
	Bidding: [
		{ name: 'listingHash', type: 'uint256' },
		{ name: 'bidder', type: 'address' },
		{ name: 'amount', type: 'uint256' },
		{ name: 'nonce', type: 'uint256' },
	],
};

async function getBidSignature(
	listingSignature: string,
	bidder: ethers.Signer,
	bidAmount: BigNumberish,
	bidNonce: BigNumberish,
): Promise<string> {
	// keccak256("Bidding(uint256 listingHash,address bidder,uint256 amount,uint256 nonce)");
	const value = {
		listingHash: ethers.utils.solidityKeccak256(['bytes'], [listingSignature]),
		bidder: await bidder.getAddress(),
		amount: bidAmount,
		nonce: bidNonce,
	};

	return await (bidder as any)._signTypedData(
		{
			name: 'HinataMarketV2',
			version: '1.0',
			chainId: (await bidder.provider.getNetwork()).chainId,
			verifyingContract: getContract('marketplace-v2').address,
		},
		GASLESS_BID_TYPES,
		value,
	);
}

async function placeBidGasless(listing: Listing, amount: BigNumber): Promise<void> {
	const contract = getContract('marketplace-v2');

	await ensureAmountApproved(contract.address, amount.toString(), listing.paymentTokenAddress);

	try {
		await refreshProfileData();
	} catch (err) {
		throw new HandledError('Failed to refresh profile data.', err);
	}

	const bidderData = get(profileData);
	const nonce = bidderData.lastUsedBidNonce + 1;

	// Get signature from user
	let signature: string;

	try {
		signature = await getBidSignature(listing.signature, get(appSigner), amount, nonce);
	} catch (err) {
		handleErrActionRejected(err, 'Request to sign gasless bid message was rejected.');

		throw err;
	}

	// Call API with bid data
	const params = {
		listingId: listing.listingId,
		bidPrice: amount.toString(),
		formatBidPrice: formatToken(amount, listing.paymentTokenAddress),
		nonce,
		signature,
	};

	// Build form data
	const formData = new FormData();

	for (const key in params) {
		formData.append(key, params[key]);
	}

	try {
		await axios.post(getApiUrl(null, 'gasless-listings/bid'), formData, await getAxiosConfig());
	} catch (err) {
		handleAxiosNetworkError(err);

		throw err;
	}
}

export async function placeBidFlow(listing: Listing, amount: BigNumber): Promise<void> {
	if (listing.chainStatus === 'GASLESS') {
		await placeBidGasless(listing, amount);
	} else {
		await placeBidNormal(listing, amount);
	}
}
