import { getHinataTokenContract } from '$utils/contracts/generalContractCalls';
import { appProvider, stakedHinataBalance, userHinataBalance } from '$stores/wallet';
import { ethers } from 'ethers';
import { get } from 'svelte/store';
import { getTotalStakedRewardsBalance, getTotalStakedTokens } from './staking';

export const hinataTokensBalance = async (userAddress: string) => {
	try {
		const hinataContract = getHinataTokenContract(get(appProvider));
		const balanceBigNumber = await hinataContract.balanceOf(userAddress);

		userHinataBalance.set(+ethers.utils.formatEther(balanceBigNumber));

		return +ethers.utils.formatEther(balanceBigNumber);
	} catch (error) {
		console.log(error);
		return 0;
	}
};

export const getAllTokenBalances = async (userAddress: string) => {
	await hinataTokensBalance(userAddress);
	await getTotalStakedTokens(userAddress);

	if (get(stakedHinataBalance) > 0) {
		await getTotalStakedRewardsBalance(userAddress);
	}
};
