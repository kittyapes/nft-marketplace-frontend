import type { ContractError } from '$interfaces/contractError';
import { getOnChainListing } from '$utils/contracts/listing';
import { ensureAmountApproved, getTokenDetails } from '$utils/contracts/token';
import { getContract } from '$utils/misc/getContract';
import { notifyError } from '$utils/toast';
import { ethers } from 'ethers';
import { noTryAsync } from 'no-try';

export async function placeBidFlow(listingId: string, amount: string) {
	const listing = await getOnChainListing(listingId);

	if (!listing?.isValidOnChainListing) {
		notifyError('Failed to Place Bid: Listing is no longer valid');
		return;
	}

	const contract = getContract('marketplace');

	await ensureAmountApproved(contract.address, amount, listing.payToken);

	const token = await getTokenDetails(listing.payToken);

	const [err, res] = (await noTryAsync(async () => contract.bid(listingId, ethers.utils.parseUnits(amount, token.decimals)))) as [ContractError, any];

	if (err) {
		console.log(err);
		notifyError(err.error.message);
		return;
	}

	const txRes = await res.wait(1);
}
