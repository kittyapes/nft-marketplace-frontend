import { appSigner, currentUserAddress } from '$stores/wallet';
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
