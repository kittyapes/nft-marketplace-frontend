import { HinataMarketplaceContractAddress } from '$constants/contractAddresses';
import { contractPurchaseListing, getOnChainListing } from '$utils/contracts/listing';
import { ensureAmountApproved } from '$utils/contracts/token';
import { notifyError, notifySuccess } from '$utils/toast';
import { noTryAsync } from 'no-try';

export async function salePurchase(listingId: string, price: string) {
	const listing = await getOnChainListing(listingId);

	const contractApproved = await ensureAmountApproved(HinataMarketplaceContractAddress, price, listing.payToken);

	if (!contractApproved) {
		notifyError('Insufficient Allowance to Execute Transaction.');

		// No need to proceed if there's no allowance
		return;
	}

	const [err, res] = await noTryAsync(() => contractPurchaseListing(listingId));

	if (err) {
		console.error(err);
		notifyError('Failed to purchase listing on chain!');
		return false;
	}

	notifySuccess('Purchased listing on chain!');

	return true;
}
