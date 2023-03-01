import { getContract } from '$utils/misc/getContract';
import { ethers } from 'ethers';
import contractCaller from '$contracts/contractCaller';

enum StakeDurationsEnum {
	THREE_MONTHS,
	SIX_MONTHS,
	TWELVE_MONTHS,
}

/*
 * Read Functions
 * */

export async function getUserStakes(userAddress: string) {
	const stakingContract = getContract('staking');
	const userStakes = await stakingContract.getStakesByAccount(userAddress);
	// need to test which format of the values is returned

	// TODO: Not sure if the conversion is correct here (seemed correct in my local testing)
	return userStakes.map((item) => ({
		amount: +ethers.utils.formatEther(item.amount),
		lockedAt: +ethers.utils.formatUnits(item.lockedAt, 0),
		lockPeriod: +ethers.utils.formatUnits(item.lockPeriod, 0),
		reward: +ethers.utils.formatEther(item.reward),
		rewardPerTokenPaid: +ethers.utils.formatEther(item.rewardPerTokenPaid),
	}));
}

export async function getTotalAmountUserStaked(userAddress: string) {
	const stakingContract = getContract('staking');
	const amountStaked = await stakingContract.getStakeAmountByAccount(userAddress);

	return +ethers.utils.formatEther(amountStaked);
}

export async function getClaimableTokens(userAddress: string) {
	const stakingContract = getContract('staking');

	const earnedRewards = await stakingContract.earned(userAddress);

	return +ethers.utils.formatEther(earnedRewards);
}

export async function getRewardPerTokenStaked() {
	const stakingContract = getContract('staking');
	const rewardPerToken = await stakingContract.rewardPerToken();

	return +ethers.utils.formatUnits(rewardPerToken, 0);
}

export async function lastTimeRewardWasApplied() {
	const stakingContract = getContract('staking');
	const lastTimestamp = await stakingContract.lastTimeRewardAppliable();

	return +ethers.utils.formatUnits(lastTimestamp, 0);
}

export async function calculateApr() {
	return 0;
}

/*
 * Write Functions
 * */

export async function claimStakingRewards() {
	const stakingContract = getContract('staking');

	await contractCaller(stakingContract, 'claim', 150, 1);

	return true;
}

export async function stakeTokens(amount: number, duration: StakeDurationsEnum) {
	const stakingContract = getContract('staking');

	await contractCaller(stakingContract, 'deposit', 150, 1, ethers.utils.parseEther(amount.toString()), duration);

	return true;
}

export async function withdrawUnlockedTokensByStakeId(stakeId: number, amount: number) {
	const stakingContract = getContract('staking');

	await contractCaller(stakingContract, 'deposit', 150, 1, ethers.utils.parseEther(amount.toString()), stakeId, amount);

	return true;
}
