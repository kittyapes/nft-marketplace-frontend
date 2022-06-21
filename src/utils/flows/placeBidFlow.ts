import type { ContractError } from '$interfaces/contractError';
import { getContract } from '$utils/misc/getContract';
import { notifyError } from '$utils/toast';
import type { BigNumber } from 'ethers';
import { noTryAsync } from 'no-try';

export async function placeBidFlow(listingId: string, amount: BigNumber) {
	const contract = getContract('marketplace');

	const [err, res] = (await noTryAsync(async () => contract.bid(listingId, amount))) as [ContractError, any];

	if (err) {
		console.log(err);
		notifyError(err.error.message);
		return;
	}

	const txRes = await res.wait(1);

	console.log(txRes);
}
