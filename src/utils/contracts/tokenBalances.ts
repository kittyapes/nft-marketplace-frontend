import { stakingContract } from '$constants/contractAddresses';
import { currentUserAddress, hinataStakingAllowance, stakedHinataBalance, userHinataBalance } from '$stores/wallet';
import { getContract } from '$utils/misc/getContract';
import { notifyError, notifySuccess } from '$utils/toast';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import { getTotalStakedRewardsBalance, getTotalStakedTokens } from './staking';

export const hinataTokensBalance = async (userAddress: string) => {
	try {
		const hinataContract = getContract('token');
		const balanceBigNumber = await hinataContract.balanceOf(userAddress);

		userHinataBalance.set(parseFloat(ethers.utils.formatEther(balanceBigNumber)));

		return ethers.utils.formatEther(balanceBigNumber);
	} catch (error) {
		return '0';
	}
};

export const checkHinataAllowance = async (address: string) => {
	try {
		const hinataContract = getContract('token');

		const allowance = await hinataContract.allowance(address, stakingContract);

		hinataStakingAllowance.set(+ethers.utils.formatEther(allowance));

		return +ethers.utils.formatEther(allowance);
	} catch (error) {
		hinataStakingAllowance.set(0);
		return 0;
	}
};

export const increaseHinataAllowance = async () => {
	try {
		const hinataContract = getContract('token');

		const txt = await hinataContract.approve(stakingContract, ethers.utils.parseEther('999999999999999999999999999999999999000000000000000000'));

		await txt.wait(1);

		await checkHinataAllowance(get(currentUserAddress));
		notifySuccess('Successfully executed transaction');

		return true;
	} catch (error) {
		notifyError(error.message || JSON.stringify(error));

		return false;
	}
};

export const getAllTokenBalances = async (userAddress: string) => {
	await hinataTokensBalance(userAddress);
	await getTotalStakedTokens(userAddress);
	await checkHinataAllowance(userAddress);

	if (get(stakedHinataBalance) > 0) {
		await getTotalStakedRewardsBalance(userAddress);
	}
};
