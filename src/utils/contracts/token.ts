import { appProvider, appSigner, currentUserAddress } from '$stores/wallet';
import { notifyError, notifySuccess, notifyWarning } from '$utils/toast';
import type { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
import { noTryAsync } from 'no-try';
import { get } from 'svelte/store';
import { getMockErc20TokenContract } from './generalContractCalls';

export function isEther(tokenAddress: string) {
	return tokenAddress === '0x0000000000000000000000000000000000000000';
}

export async function getTokenDetails(tokenAddress: string) {
	try {
		if (isEther(tokenAddress)) {
			return {
				name: 'ETH',
				decimals: 18,
				symbol: 'ETH'
			};
		}
		const contract = getMockErc20TokenContract(get(appProvider), tokenAddress);

		// Contract Name
		const name = await contract.name();

		// Contract Decimals
		const decimals = await contract.decimals();

		// Contract Symbol
		const symbol = await contract.symbol();

		return { name, decimals, symbol };
	} catch (error) {
		// If we can't find token details, its likely ETH
		return {
			name: 'ETH',
			decimals: 18,
			symbol: 'ETH'
		};
	}
}

export async function getTokenBalance(tokenAddress: string, userAddress: string, decimals?: number): Promise<BigNumber> {
	if (isEther(tokenAddress)) {
		return await get(appProvider).getBalance(userAddress);
	}

	if (!decimals) {
		decimals = (await getTokenDetails(tokenAddress)).decimals;
	}

	const contract = getMockErc20TokenContract(get(appProvider), tokenAddress);
	const balance = await contract.balanceOf(userAddress);

	return balance;
}

export async function hasEnoughBalance(tokenAddress: string, userAddress: string, requiredBalance: string) {
	const tokenDetails = await getTokenDetails(tokenAddress);
	const balance = await getTokenBalance(tokenAddress, userAddress, tokenDetails.decimals);

	const parsedRequired = parseUnits(requiredBalance, tokenDetails.decimals);

	return balance.gte(parsedRequired);
}

export async function contractGetTokenAllowance(owner: string, spender: string, tokenAddress: string): Promise<BigNumber> {
	if (isEther(tokenAddress)) {
		return parseUnits('999999999999999999999999999999999999000000000000000000', 18);
	}
	const contract = getMockErc20TokenContract(get(appSigner), tokenAddress);

	const allowance = await contract.allowance(owner, spender);
	console.log(allowance);

	return allowance;
}

export async function contractApproveToken(spender: string, amount: BigNumber, tokenAddress: string, tokenDecimals: number) {
	if (isEther(tokenAddress)) {
		return;
	}
	const contract = getMockErc20TokenContract(get(appSigner), tokenAddress);

	// We can't assume the token is ethereum
	const approveTx = await contract.approve(spender, parseUnits(amount.toString(), tokenDecimals));
	await approveTx.wait(1);
}

export async function ensureAmountApproved(spender: string, amount: string, tokenAddress: string) {
	if (isEther(tokenAddress)) {
		return true;
	}

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
