import { HinataMarketplaceContractAddress } from '$constants/contractAddresses';
import type { ContractError } from '$interfaces/contractError';
import { getOnChainListing } from '$utils/contracts/listing';
import { ensureAmountApproved, getTokenDetails } from '$utils/contracts/token';
import { getContract } from '$utils/misc/getContract';
import { notifyError } from '$utils/toast';
import { ethers } from 'ethers';
import { noTryAsync } from 'no-try';

export async function placeBidFlow(listingId: string, amount: string) {
	const listing = await getOnChainListing(listingId);

	await ensureAmountApproved(HinataMarketplaceContractAddress, amount, listing.payToken);

	const token = await getTokenDetails(listing.payToken);
	const contract = getContract('marketplace');

	const [err, res] = (await noTryAsync(async () => contract.bid(listingId, ethers.utils.parseUnits(amount, token.decimals)))) as [ContractError, any];

	if (err) {
		console.log(err);
		notifyError(err.error.message);
		return;
	}

	const txRes = await res.wait(1);

	console.log(txRes);
}
