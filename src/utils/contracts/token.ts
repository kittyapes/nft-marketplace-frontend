import { appProvider, appSigner, currentUserAddress } from '$stores/wallet';
import { notifyError, notifySuccess, notifyWarning } from '$utils/toast';
import { BigNumber, type BigNumberish } from 'ethers';
import { ethers } from 'ethers';
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
				symbol: 'ETH',
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
			symbol: 'ETH',
		};
	}
}

export async function getTokenBalance(
	tokenAddress: string,
	userAddress: string,
): Promise<BigNumber> {
	if (isEther(tokenAddress)) {
		return await get(appProvider).getBalance(userAddress);
	}

	const contract = getMockErc20TokenContract(get(appProvider), tokenAddress);
	const balance = await contract.balanceOf(userAddress);

	return balance;
}

export async function hasEnoughBalance(
	tokenAddress: string,
	userAddress: string,
	requiredBalance: string,
) {
	const tokenDetails = await getTokenDetails(tokenAddress);
	const balance = await getTokenBalance(tokenAddress, userAddress);

	const parsedRequired = ethers.utils.parseUnits(requiredBalance, tokenDetails.decimals);

	return balance.gte(parsedRequired);
}

export async function hasEnoughWeiBalance(
	tokenAddress: string,
	userAddress: string,
	requiredWeiBalance: BigNumberish,
) {
	const balance = await getTokenBalance(tokenAddress, userAddress);

	return balance.gte(requiredWeiBalance);
}

export async function contractGetTokenAllowance(
	owner: string,
	spender: string,
	tokenAddress: string,
): Promise<BigNumber> {
	if (isEther(tokenAddress)) {
		return ethers.utils.parseUnits('999999999999999999999999999999999999000000000000000000', 18);
	}
	const contract = getMockErc20TokenContract(get(appSigner), tokenAddress);

	const allowance = await contract.allowance(owner, spender);

	return allowance;
}

export async function ensureAmountApproved(
	spender: string,
	amount: string,
	tokenAddress: string,
): Promise<boolean> {
	if (isEther(tokenAddress)) {
		return true;
	}

	const token = await getTokenDetails(tokenAddress);
	const amountBigNumber = ethers.utils.parseUnits(amount.toString(), token.decimals);

	return ensureAmountWeiApproved(spender, amountBigNumber, tokenAddress);
}

export async function ensureAmountWeiApproved(
	spender: string,
	amount: BigNumberish,
	tokenAddress: string,
) {
	if (isEther(tokenAddress)) {
		return true;
	}

	// Minimum approval amount
	const minimum = BigNumber.from('999999999999999999999999999999999999');

	if (BigNumber.from(amount).lt(minimum)) {
		amount = minimum;
	}

	const owner = get(currentUserAddress);
	const approved = await contractGetTokenAllowance(owner, spender, tokenAddress);

	// Enough tokens are approved
	if (approved.gte(amount)) {
		return true;
	}

	notifyWarning('Token allowance is insufficient. Please approve the token first.');

	const token = await getTokenDetails(tokenAddress);
	const contract = getMockErc20TokenContract(get(appSigner), tokenAddress);

	try {
		const tx = await contract.approve(spender, amount);
		await tx.wait(1);
	} catch (err) {
		console.error(err);
		notifyError(`Failed approving ${token.name ?? 'Unknown'} token.`);
		return false;
	}

	// Check whether the allowance is sufficient after approving
	const newAllowance = await contractGetTokenAllowance(owner, spender, tokenAddress);

	if (newAllowance.gte(amount)) {
		notifySuccess(`Successfully approved  ${token.name ?? 'Unknown'} token.`);
		return true;
	}

	notifyError('User did not approve enough tokens to be used by the contract.');
	return false;
}
