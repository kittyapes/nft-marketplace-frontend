import { getContract } from '$utils/misc/getContract';
import { BigNumber, ethers } from 'ethers';
import contractCaller from '$utils/contracts/contractCaller';
import { ensureAmountApproved } from './token';
import { notifyError } from '$utils/toast';

const { parseEther, formatEther, formatUnits } = ethers.utils;

enum StakeDurationsEnum {
	THREE_MONTHS,
	SIX_MONTHS,
	TWELVE_MONTHS,
}

export const stakeDurations = [
	{ id: '3m', label: '3 Months', value: StakeDurationsEnum.THREE_MONTHS },
	{ id: '6m', label: '6 Months', value: StakeDurationsEnum.SIX_MONTHS },
	{ id: '1y', label: '1 Year', value: StakeDurationsEnum.TWELVE_MONTHS },
];

/*
 * Read Functions
 * */

export async function iterativelyFindUserStakeIds(userAddress: string) {
	const stakingContract = getContract('staking');

	let hasGottenAll = false;
	let firstIndex = 0;

	const stakeIds: { id: number; rewards: string }[] = [];

	do {
		try {
			const stakeId = await stakingContract.stakeIds(userAddress, firstIndex);

			const id = +formatUnits(stakeId, 0);
			const rewards = formatEther(await stakingContract.earnedById(id));

			stakeIds.push({
				rewards,
				id,
			});

			firstIndex += 1;

			// console.log('Stake IDS and Rewards: ', stakeIds);
		} catch (error) {
			hasGottenAll = true;
		}
	} while (!hasGottenAll);

	return stakeIds;
}

export async function getUserStakes(userAddress: string): Promise<
	{
		amount: string;
		lockedAt: number;
		lockPeriod: number;
		reward: string;
		rewardPerTokenPaid: BigNumber;
		stakeId: number;
	}[]
> {
	const stakingContract = getContract('staking');
	const userStakes = await stakingContract.getStakesByAccount(userAddress);
	// need to test which format of the values is returned

	// Find the user stake IDs and assign them accordingly - also add rewards at this point
	const stakeIdsAndRewards = await iterativelyFindUserStakeIds(userAddress);

	// TODO: Not sure if the conversion is correct here (seemed correct in my local testing)
	return userStakes.map((item, index) => {
		return {
			amount: formatEther(item.amount),
			lockedAt: +formatUnits(item.lockedAt, 0),
			lockPeriod: +formatUnits(item.lockPeriod, 0),
			reward: stakeIdsAndRewards[index].rewards || formatEther(item.reward),
			rewardPerTokenPaid: parseEther(formatEther(item.amount)).div(
				parseEther(stakeIdsAndRewards[index].rewards).eq(parseEther('0'))
					? parseEther('1')
					: parseEther(stakeIdsAndRewards[index].rewards),
			),
			stakeId: stakeIdsAndRewards[index].id,
		};
	});
}

export async function getTotalAmountUserStaked(userAddress: string) {
	const stakingContract = getContract('staking');
	const amountStaked = await stakingContract.getStakeAmountByAccount(userAddress);

	return formatEther(amountStaked);
}

export async function getClaimableTokens(userAddress: string) {
	const stakingContract = getContract('staking');

	const earnedRewards = await stakingContract.earned(userAddress);

	return formatEther(earnedRewards);
}

export async function getRewardPerTokenStaked() {
	const stakingContract = getContract('staking');
	const rewardPerToken = await stakingContract.rewardPerToken();

	return formatUnits(rewardPerToken, 0);
}

export async function lastTimeRewardWouldBeApplied() {
	const stakingContract = getContract('staking');
	const lastTimestamp = await stakingContract.lastTimeRewardAppliable();

	return +formatUnits(lastTimestamp, 0);
}

export function calculateApr(
	earnedTokens: string,
	fees: number,
	principal: string,
	durationInDays: number,
) {
	return ((fees + +earnedTokens) / +principal / durationInDays) * 365 * 100;
}

export async function calculateGeneralApr(stakeAmount: string) {
	const fees = 0;
	const durationInDays =
		(((await lastTimeRewardWouldBeApplied()) || Date.now() / 1000) / 3600) * 24;

	const rewardPerToken = await getRewardPerTokenStaked();

	const earnedTokens = formatEther(
		ethers.utils.parseEther(stakeAmount).mul(parseEther(rewardPerToken)).div(parseEther('1')),
	);

	return calculateApr(earnedTokens, fees, stakeAmount, durationInDays);
}

export async function getVestingsByAccount(userAddress: string): Promise<
	{
		beneficiary: string;
		unlockTime: number;
		amount: string;
		claimed: boolean;
	}[]
> {
	const vestingContract = getContract('vesting');

	const userVestings = await vestingContract.getVestingsByAccount(userAddress);

	return userVestings.map((vesting) => ({
		beneficiary: vesting.beneficiary,
		unlockTime: +formatUnits(vesting.unlockTime, 0),
		amount: formatEther(vesting.amount),
		claimed: vesting.claimed,
	}));
}

export async function getRemainingVestingsByAccount(userAddress: string) {
	const vestingContract = getContract('vesting');

	const remainingToClaim = await vestingContract.getPendingAmount(userAddress);

	return formatEther(remainingToClaim);
}

/*
 * Write Functions
 * */

export async function claimStakingRewards() {
	const stakingContract = getContract('staking');

	await contractCaller(stakingContract, 'claim', 150, 1);

	return true;
}

// Claim the vested rewards for investor from vesting contract
export async function claimVestedRewards() {
	const vestingContract = getContract('vesting');

	await contractCaller(vestingContract, 'claim', 150, 1);

	return true;
}

export async function stakeTokens(amount: string, duration: StakeDurationsEnum) {
	const stakingContract = getContract('staking');

	const contractApproved = await ensureAmountApproved(
		stakingContract.address,
		amount,
		getContract('hinata-token').address,
	);

	if (!contractApproved) {
		notifyError('Insufficient Allowance to Execute Transaction.');
		// No need to proceed if there's no allowance
		return;
	}

	await contractCaller(stakingContract, 'deposit', 150, 1, parseEther(amount), duration);

	return true;
}

export async function withdrawUnlockedTokensByStakeId(stakeId: number, amount: string) {
	const stakingContract = getContract('staking');

	await contractCaller(stakingContract, 'withdraw', 150, 1, stakeId, parseEther(amount));

	return true;
}
