import type { Listing } from '$utils/api/listing';
import contractCaller from '$utils/contracts/contractCaller';
import { contractPurchaseListing } from '$utils/contracts/listing';
import { ensureAmountApproved } from '$utils/contracts/token';
import { getChainListingData, stringListingTypeToEnum } from '$utils/listings';
import { getContract, getContractData } from '$utils/misc/getContract';
import { notifyError, notifySuccess } from '$utils/toast';
import dayjs from 'dayjs';
import { noTryAsync } from 'no-try';

/**
 * Purchase a gas based listing.
 * @param listing Listing data gathered from API.
 * @returns A boolean indicating if the purchase was successful.
 */
async function purchaseNormal(listing: Listing) {
	const onChainListingData = await getChainListingData(listing.listingId);

	if (!onChainListingData) {
		notifyError('Failed to Make Purchase: Listing could not be found on chain.');
		return;
	}

	const marketplaceAddress = getContractData('marketplace').address;
	const contractApproved = await ensureAmountApproved(marketplaceAddress, onChainListingData.price.toString(), listing.paymentTokenAddress);

	if (!contractApproved) {
		notifyError('Insufficient Allowance to Execute Transaction.');

		// No need to proceed if there's no allowance
		return false;
	}

	await contractPurchaseListing(listing.listingId);

	return true;
}

/**
 * Purchase a gasless listing.
 * @param listing Listing data gathered from API.
 * @returns A boolean indicating if the purchase was successful.
 */
async function purchaseGasless(listing: Listing) {
	// Get marketplace contract
	const marketplaceContract = getContract('marketplace-v2');

	// Make sure amount of tokens equal or greater than the price of the sale listing
	// is approved to be used by the marketpace contract
	const approvalSuccessful = await ensureAmountApproved(marketplaceContract.address, listing.listing.price, listing.paymentTokenAddress);

	if (!approvalSuccessful) {
		notifyError("Failed to purchase a gasless listing. Could't approve amount of tokens required for the purchase.");
		return false;
	}

	const args = [
		{
			seller: listing.seller,
			payToken: listing.paymentTokenAddress,
			price: listing.listing.price,
			reservePrice: listing.listing.reservePrice || listing.listing.price,
			startTime: dayjs(listing.startTime).unix(),
			duration: listing.duration,
			expireTime: listing.signatureExpiryTimestamp,
			quantity: listing.nfts[0].amount,
			listingType: stringListingTypeToEnum(listing.listingType),
			collections: listing.nfts.map((nft) => nft.contractAddress),
			tokenIds: listing.nfts.map((nft) => nft.nftId),
			tokenAmounts: listing.nfts.map((nft) => nft.amount),
		},
		listing.nonce,
		listing.signature,
	];

	try {
		await contractCaller(marketplaceContract, 'purchaseListing', 150, 1, ...args);
	} catch (err) {
		if (err.message.includes('INVALID_SIGNATURE')) {
			console.error('Gasless listing purchase error: Invalid signature submitted to contract.');
			notifyError('Sorry, the listing does not contain a valid signature.');

			return false;
		}

		if (err.message.includes('USED_SIGNATURE')) {
			console.error('Gasless listing purchase error: Signature already used.');
			notifyError('Sorry, this listing has already been purchased.');

			return false;
		}

		throw err;
	}

	return true;
}

/**
 * Purchase a gasless or gas based listing.
 * @param listing Listing data gathered from API.
 * @returns A boolean indicating if the purchase was successful.
 */
export async function salePurchase(listing: Listing): Promise<boolean> {
	const fn = listing.chainStatus === 'GASLESS' ? purchaseGasless : purchaseNormal;

	let purchaseSuccess: boolean;

	try {
		purchaseSuccess = await fn(listing);
	} catch (err) {
		if (err.code === 'ACTION_REJECTED') {
			notifyError('You have rejected the transaction. Could not purchase the listing.');
			return false;
		}

		console.error(err);
		notifyError('Sorry, failed to make your purchase. An unexpected error has occured.');

		return false;
	}

	if (purchaseSuccess) {
		notifySuccess('Successfully purchased listing.');
	}

	return purchaseSuccess;
}
