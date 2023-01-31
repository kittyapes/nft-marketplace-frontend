import type { Listing } from '$utils/api/listing';
import contractCaller from '$utils/contracts/contractCaller';
import { listingExistsOnChain } from '$utils/listings';
import { getContract } from '$utils/misc/getContract';
import { notifyError, notifySuccess } from '$utils/toast';

async function cancelNormal(listing: Listing): Promise<boolean> {
	const listingFoundOnChain = listingExistsOnChain(listing.listingId);

	if (!listingFoundOnChain) {
		notifyError('Failed to Cancel Listing: Listing is no longer valid (not on chain).');
		return false;
	}

	console.debug('[Listing] Cancelling listing with ID: ' + listing.listingId);

	const contract = getContract('marketplace');
	await contractCaller(contract, 'cancelListing', 150, 1, listing.listingId);

	return true;
}

async function cancelGasless(listing: Listing): Promise<boolean> {
	const contract = getContract('marketplace-v2');
	await contractCaller(contract, 'cancelSignature', 150, 1, listing.signature);

	return true;
}

/**
 * Cancel a gasless or gas based listing.
 * @param listing Listing data gathered from API.
 * @returns A boolean indicating if the cancellation was successful.
 */
export async function cancelListingFlow(listing: Listing): Promise<boolean> {
	const fn = listing.chainStatus === 'GASLESS' ? cancelGasless : cancelNormal;

	let cancelSuccess: boolean;

	try {
		cancelSuccess = await fn(listing);
	} catch (err) {
		if (err.code === 'ACTION_REJECTED') {
			notifyError('You have rejected the transaction. Could not cancel your listing.');
			return false;
		}

		console.error('Caught an error while cancelling a listing:', err);
		notifyError('Sorry, failed to cancel your listing. An unexpected error has occured.');

		return false;
	}

	if (cancelSuccess) {
		notifySuccess('Successfully cancelled your listing.');
	}

	return cancelSuccess;
}
