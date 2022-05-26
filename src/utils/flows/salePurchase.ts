import { HinataMarketplaceContractAddress } from '$constants/contractAddresses';
import { currentUserAddress } from '$stores/wallet';
import { contractPurchaseListing } from '$utils/contracts/listing';
import { contractApproveToken, contractGetTokenAllowance } from '$utils/contracts/token';
import { notifyError, notifySuccess } from '$utils/toast';
import { BigNumber, ethers } from 'ethers';
import { noTryAsync } from 'no-try';
import { get } from 'svelte/store';

export async function salePurchase(listingId: string, price: BigNumber) {
	const allowance = await contractGetTokenAllowance(get(currentUserAddress), HinataMarketplaceContractAddress);

	console.info('Token allowance for contract is:', ethers.utils.formatEther(allowance));

	if (allowance.lt(price)) {
		notifySuccess('Token allowance is insufficient. Please approve the token first.');

		console.info('Approving token allowance for contract.');
		const [approveErr, approveRes] = await noTryAsync(() => contractApproveToken(HinataMarketplaceContractAddress, price));

		if (approveErr) {
			notifyError(approveErr.message);
			return false;
		}

		notifySuccess('Updated token allowance.');
	} else {
		notifySuccess('Token allowance is sufficient.');
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
