import { appSigner, currentUserAddress } from '$stores/wallet';
import { notifyError, notifySuccess } from '$utils/toast';
import { BigNumber, ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';
import { noTryAsync } from 'no-try';
import { get } from 'svelte/store';
import { getHinataTokenContract } from './generalContractCalls';

export async function contractGetTokenAllowance(owner: string, spender: string): Promise<ethers.BigNumber> {
	const contract = getHinataTokenContract(get(appSigner));
	const allowance = await contract.allowance(owner, spender);

	return allowance;
}

export async function contractApproveToken(spender: string, amount: BigNumber) {
	const contract = getHinataTokenContract(get(appSigner));
	console.log({ amount });

	const approveTx = await contract.approve(spender, ethers.utils.parseEther(amount.toString()));
	await approveTx.wait(1);
}

export async function ensureAmountApproved(spender: string, amount: BigNumber) {
	const approved = await contractGetTokenAllowance(get(currentUserAddress), spender);

	if (approved.lt(amount)) {
		notifySuccess('Additional token approval needed.');
		const [err, res] = await noTryAsync(async () => await contractApproveToken(spender, parseEther('100')));

		if (err) {
			console.error(err);
			notifyError('Failed approving HI token.');
			return false;
		} else {
			notifySuccess('Successfully approved HI token.');
		}
	}

	return true;
}
