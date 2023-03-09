<script lang="ts">
	import {
		claimableHinataStakingRewards,
		currentUserAddress,
		userStakes,
		walletHinataBalance,
	} from '$stores/wallet';
	import {
		calculateApr,
		calculateGeneralApr,
		getClaimableTokens,
		getUserStakes,
		lastTimeRewardWouldBeApplied,
	} from '$utils/contracts/staking';
	import { getTokenBalance } from '$utils/contracts/token';
	import { getContract } from '$utils/misc/getContract';
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import Stake from './Stake.svelte';
	import StakeUnstakeSwitch from './StakeUnstakeSwitch.svelte';
	import type { Position } from './types';
	import Unstake from './Unstake.svelte';

	let stateStakeUnstake: 'stake' | 'unstake' = 'stake';
	let unstakeId = 0;
	let selectedUnStakeAmount = '0';
	let maxUnstakeAmount = '0';

	async function loadUp() {
		walletHinataBalance.set(
			ethers.utils.formatEther(
				await getTokenBalance(getContract('hinata-token').address, $currentUserAddress, 18),
			),
		);

		const addressStakes = await getUserStakes($currentUserAddress);

		const lastTimeRewardApplied = await lastTimeRewardWouldBeApplied();

		const userCachedStakes: Position[] = [];
		await Promise.all(
			addressStakes.map(async (item) => {
				const dateDifference = (lastTimeRewardApplied - item.lockedAt) / (3600 * 24);

				const generalApr = await calculateGeneralApr(item.amount);
				const actualApr = calculateApr(item.reward, 0, item.amount, dateDifference);

				userCachedStakes.push({
					amount: item.amount,
					endTime: 1000 * (item.lockedAt + item.lockPeriod),
					interestType: 'apr',
					aprOrApy: +item.reward <= 0 ? generalApr : actualApr,
					unstakeAvailable: Date.now() > 1000 * (item.lockedAt + item.lockPeriod),
					stakeId: item.stakeId,
					stakeTime: item.lockedAt * 1000,
				});
			}),
		);

		userStakes.set(userCachedStakes);

		const stakingRewards = await getClaimableTokens($currentUserAddress);

		claimableHinataStakingRewards.set([{ token: 'Hinata', amount: stakingRewards }]);
	}

	function triggerUnstakeUI(event: { detail: { stakeId: number; amount: string } }) {
		stateStakeUnstake = 'unstake';
		unstakeId = event.detail.stakeId;
		maxUnstakeAmount = event.detail.amount;
		selectedUnStakeAmount = event.detail.amount;
	}

	onMount(async () => {
		await loadUp();
	});

	currentUserAddress.subscribe(async (_address) => {
		await loadUp();
	});
</script>

<div class="flex-grow">
	<div class="text-lg">Your Stake</div>

	<StakeUnstakeSwitch bind:state={stateStakeUnstake} />

	{#if stateStakeUnstake === 'stake'}
		<Stake on:unstake-tokens={triggerUnstakeUI} on:reload-stake-data={loadUp} />
	{:else}
		<Unstake
			on:unstake-tokens={triggerUnstakeUI}
			on:reload-stake-data={loadUp}
			{maxUnstakeAmount}
			{unstakeId}
			{selectedUnStakeAmount}
		/>
	{/if}
</div>
