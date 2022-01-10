import {
	appProvider,
	appSigner,
	currentUserAddress,
	stakedHinataBalance,
	stakingWaifuRewards
} from '$stores/wallet';
import daysFromNow from '$utils/daysFromNow';
import { notifyError, notifySuccess } from '$utils/toast';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import { getStakingContract } from './generalContractCalls';
import { getAllTokenBalances } from './tokenBalances';

export const stakeTokens = async (tokensToStake: number, durationLockUp: number) => {
	try {
		const stakingContract = getStakingContract(get(appSigner));

		const txt = await stakingContract.stake(
			ethers.utils.parseEther(tokensToStake.toString()),
			ethers.utils.parseEther(durationLockUp.toString())
		);

		txt.wait(1);

		// Notify User
		notifySuccess(
			`Successfully staked ${tokensToStake} for ${daysFromNow(durationLockUp * 1000).days} days`
		);

		await getAllTokenBalances(get(currentUserAddress));

		return true;
	} catch (error) {
		console.log(error);
		notifyError(error.message || JSON.stringify(error));
		return false;
	}
};

export const getTotalStakedTokens = async (userAddress: string) => {
	try {
		const stakingContract = getStakingContract(get(appProvider));

		const stakedHinataInEth = await stakingContract.getUsersTotalStaked(userAddress);
		const stakedAmt = +ethers.utils.formatEther(stakedHinataInEth);

		// Set to store
		stakedHinataBalance.set(stakedAmt);

		return stakedAmt;
	} catch (error) {
		// console.log(error);
		stakedHinataBalance.set(0);
		return false;
	}
};

export const getTotalStakedRewardsBalance = async (userAddress: string) => {
	try {
		const stakingContract = getStakingContract(get(appProvider));

		const waifuRewardsBigNumber = await stakingContract.calculateRewards(userAddress);
		const waifuRewardsAmt = +ethers.utils.formatEther(waifuRewardsBigNumber);

		// Set to store
		stakingWaifuRewards.set(waifuRewardsAmt);

		return waifuRewardsAmt;
	} catch (error) {
		// console.log(error);
		stakingWaifuRewards.set(0);
		return false;
	}
};

// claim rewards
export const claimWaifuRewards = async () => {
	try {
		const stakingContract = getStakingContract(get(appSigner));

		const txt = await stakingContract.claimRewards();

		// Wait for confirmation
		txt.wait(1);

		// Refresh balances
		await getAllTokenBalances(get(currentUserAddress));

		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};
