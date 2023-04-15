import { getContract } from '$utils/misc/getContract';
import type { BigNumber, BigNumberish, ethers } from 'ethers';
import contractCaller from './contractCaller';
import { notifyError } from '$utils/toast';
import { ErrNotificationError, handleErrActionRejected } from '$utils';

const OFFER_MESSAGE_TYPES = {
	Offer: [
		{ name: 'collection', type: 'address' },
		{ name: 'tokenId', type: 'uint256' },
		{ name: 'tokenAmount', type: 'uint256' },
		{ name: 'bidder', type: 'address' },
		{ name: 'payToken', type: 'address' },
		{ name: 'amount', type: 'uint256' },
		{ name: 'expireTime', type: 'uint256' },
		{ name: 'nonce', type: 'uint256' },
	],
};

/**
 * Signs an EIP-712 typed message representing an offer to purchase a listing without paying gas fees.
 *
 * @param buyer - The signer for the offer creator's Ethereum account.
 * @param collection - The address of the NFT collection the listing belongs to.
 * @param tokenId - The ID of the NFT being offered.
 * @param tokenAmount - The amount of the NFT being offered.
 * @param payToken - The address of the ERC-20 token being used to pay for the offer.
 * @param amount - The amount of ERC-20 tokens being offered for the NFT.
 * @param expireTime - The expiration time of the offer, in seconds since the Unix epoch.
 * @param nonce - A unique value to prevent replay attacks.
 * @returns The signature of the typed message as a hexadecimal string.
 *
 * @remarks
 * This function signs an EIP-712 typed message representing an offer to purchase an NFT listing without paying gas fees.
 * The message includes the following fields:
 * - collection: The address of the NFT collection the listing belongs to.
 * - tokenId: The ID of the NFT being offered.
 * - tokenAmount: The amount of the NFT being offered.
 * - payToken: The address of the ERC-20 token being used to pay for the offer.
 * - amount: The amount of ERC-20 tokens being offered for the NFT.
 * - expireTime: The expiration time of the offer, in seconds since the Unix epoch.
 * - nonce: A unique value to prevent replay attacks.
 *
 * The function returns the signature of the typed message as a hexadecimal string. The signature can be used to submit
 * the offer transaction to the marketplace smart contract without paying gas fees, using the `apiSubmitOffer` function.
 *
 * Example usage:
 * ```
 * const signature = await getGaslessListingSignature(
 *   buyer,
 *   collectionAddress,
 *   tokenId,
 *   tokenAmount,
 *   payTokenAddress,
 *   amount,
 *   expireTime,
 *   nonce
 * );
 * ```
 */

export async function getOfferSignature(
	buyer: ethers.Signer,
	collection: string,
	tokenId: BigNumber,
	tokenAmount: BigNumber,
	payToken: string,
	amount: BigNumber,
	expireTime: number,
	nonce: BigNumber,
) {
	const message = {
		collection,
		tokenId,
		tokenAmount,
		bidder: await buyer.getAddress(),
		payToken,
		amount,
		expireTime,
		nonce,
	};

	console.log({
		collection,
		tokenId: tokenId.toString(),
		tokenAmount: tokenAmount.toString(),
		bidder: await buyer.getAddress(),
		payToken,
		amount: amount.toString(),
		expireTime: expireTime.toString(),
		nonce: nonce.toString(),
	});

	const domain = {
		name: 'HinataMarketV2',
		version: '1.0',
		chainId: (await buyer.provider.getNetwork()).chainId,
		verifyingContract: getContract('marketplace-v2').address,
	};

	try {
		return await (buyer as any)._signTypedData(domain, OFFER_MESSAGE_TYPES, message);
	} catch (err) {
		handleErrActionRejected(err, 'User rejected offer message signature.');
	}
}

export async function contractAcceptOffer(
	collection: string,
	tokenId: BigNumberish,
	tokenAmount: BigNumberish,
	buyer: string,
	payToken: string,
	offerPrice: BigNumberish,
	expireTime: BigNumberish,
	nonce: BigNumberish,
	signature: string,
) {
	console.log({
		collection,
		tokenId,
		tokenAmount,
		buyer,
		payToken,
		offerPrice,
		expireTime,
		nonce,
		signature,
	});

	const args = [
		{
			collection,
			tokenId,
			tokenAmount,
			bidder: buyer,
			payToken,
			bidAmount: offerPrice,
			expireTime,
			nonce,
		},
		signature,
	];

	// Get marketplace contract
	const marketplaceContract = getContract('marketplace-v2');

	try {
		await contractCaller(marketplaceContract, 'acceptOffer', 150, 1, ...args);
	} catch (err) {
		handleErrActionRejected(err);

		if (
			err.message.includes('invalid signature') ||
			err.message.includes('INVALID_SIGNATURE_FOR_OFFER')
		) {
			throw new ErrNotificationError(
				'Sorry, the offer does not contain a valid signature. Could not accept the offer.',
				err,
			);
		}

		throw err;
	}
}
