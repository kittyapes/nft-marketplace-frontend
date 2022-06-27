import { appProvider, appSigner, currentUserAddress } from '$stores/wallet';
import { notifyError, notifySuccess, notifyWarning } from '$utils/toast';
import type { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { noTryAsync } from 'no-try';
import { get } from 'svelte/store';
import { getMockErc20TokenContract } from './generalContractCalls';

export async function getTokenDetails(tokenAddress: string) {
	try {
		const contract = getMockErc20TokenContract(get(appProvider), tokenAddress);

		// Contract Name
		const name = await contract.name();

		// Contract Decimals
		const decimals = await contract.decimals();

		return { name, decimals };
	} catch (error) {
		// If we can't find token details, its likely ETH
		return {
			name: 'ETH',
			decimals: 18
		};
	}
}

export async function contractGetTokenAllowance(owner: string, spender: string, tokenAddress: string): Promise<BigNumber> {
	const contract = getMockErc20TokenContract(get(appSigner), tokenAddress);

	const allowance = await contract.allowance(owner, spender);

	return allowance;
}

export async function contractApproveToken(spender: string, amount: BigNumber, tokenAddress: string, tokenDecimals: number) {
	const contract = getMockErc20TokenContract(get(appSigner), tokenAddress);

	// We can't assume the token is ethereum
	const approveTx = await contract.approve(spender, parseUnits(amount.toString(), tokenDecimals));
	await approveTx.wait(1);
}

export async function ensureAmountApproved(spender: string, amount: string, tokenAddress: string) {
	const approved = await contractGetTokenAllowance(get(currentUserAddress), spender, tokenAddress);
	const token = await getTokenDetails(tokenAddress);
	const amountBigNumber = parseUnits(amount.toString(), token.decimals);

	if (approved.lt(amountBigNumber)) {
		notifyWarning('Token allowance is insufficient. Please approve the token first.');

		const [err, res] = await noTryAsync(async () => await contractApproveToken(spender, amountBigNumber, tokenAddress, token.decimals));

		if (err) {
			console.error(err);
			notifyError(`Failed approving ${token.name ?? 'Unknown'} token.`);
			return false;
		} else {
			notifySuccess(`Successfully approved  ${token.name ?? 'Unknown'} token.`);
		}
	}

	return true;
}
