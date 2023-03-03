<script lang="ts">
	import { currentUserAddress, userStakes, walletHinataBalance } from '$stores/wallet';
	import {
		calculateApr,
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
	let maxUnstakeAmount = '0';

	async function loadUp() {
		walletHinataBalance.set(
			+ethers.utils.formatEther(
				await getTokenBalance(getContract('hinata-token').address, $currentUserAddress, 18),
			),
		);

		const addressStakes = await getUserStakes($currentUserAddress);

		const lastTimeRewardApplied = await lastTimeRewardWouldBeApplied();

		const userCachedStakes: Position[] = [];
		addressStakes.map((item) => {
			const dateDifference = (lastTimeRewardApplied - item.lockedAt) / (3600 * 24);

			userCachedStakes.push({
				amount: item.amount,
				endTime: 1000 * (item.lockedAt + item.lockPeriod),
				interestType: 'apr',
				aprOrApy: calculateApr(item.reward, 0, item.amount, dateDifference),
				unstakeAvailable: Date.now() > 1000 * (item.lockedAt + item.lockPeriod),
				stakeId: item.stakeId,
				stakeTime: item.lockedAt * 1000,
			});
		});

		userStakes.set(userCachedStakes);
	}

	function triggerUnstakeUI(event: { detail: { stakeId: number; amount: string } }) {
		stateStakeUnstake = 'unstake';
		unstakeId = event.detail.stakeId;
		maxUnstakeAmount = event.detail.amount;
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
		/>
	{/if}
</div>
