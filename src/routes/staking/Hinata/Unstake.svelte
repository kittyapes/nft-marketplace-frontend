<script lang="ts">
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { claimableHinataStakingRewards, userStakes } from '$stores/wallet';
	import { withdrawUnlockedTokensByStakeId } from '$utils/contracts/staking';
	import { createEventDispatcher } from 'svelte';
	import PositionsTable from './PositionsTable.svelte';
	import RewardsTable from './RewardsTable.svelte';
	import Input from '$lib/components/v2/Input/Input.svelte';
	import { ethers } from 'ethers';

	const { parseEther } = ethers.utils;

	const dispatch = createEventDispatcher();

	export let maxUnstakeAmount = '0';
	export let unstakeId = 1;
	export let selectedUnStakeAmount = '0';

	$: highlightUnstakeItems = false;
	$: userClickedOnInput = false;

	function validateUnstakeAmount(amount: string) {
		userClickedOnInput = false;
		return (
			parseEther(selectedUnStakeAmount || '0').eq(parseEther('0')) ||
			parseEther(amount).lte(parseEther(maxUnstakeAmount))
		);
	}

	async function triggerUnstakeTokens() {
		await withdrawUnlockedTokensByStakeId(unstakeId, selectedUnStakeAmount);
		dispatch('reload-stake-data');
	}

	function triggerUnstakeUI(event: { detail: { stakeId: number; amount: string } }) {
		dispatch('unstake-tokens', event.detail);
	}

	function highlightUnstake() {
		if (parseEther(maxUnstakeAmount || '0').eq(parseEther('0')) && !userClickedOnInput) {
			highlightUnstakeItems = true;
			userClickedOnInput = true;
		}
	}

	$: if (!parseEther(maxUnstakeAmount || '0').eq(parseEther('0')) && userClickedOnInput) {
		highlightUnstakeItems = false;
		userClickedOnInput = false;
	}
</script>

<!-- Unstake amount input field -->
<div class="flex gap-x-4 mt-5">
	<div class="flex-grow">
		<Input
			bind:value={selectedUnStakeAmount}
			validator={validateUnstakeAmount}
			placeholder="Enter Amount"
			inputMode="numeric"
			class={`border-2 border-white rounded-none h-12 section-subtext hover:border-color-purple ${
				(parseEther(selectedUnStakeAmount || '0').eq(parseEther('0')) ||
					!validateUnstakeAmount(selectedUnStakeAmount)) &&
				'border-white hover:border-white opacity-50'
			}`}
			on:click={highlightUnstake}
		>
			<PrimaryButton
				slot="end-icon"
				extButtonClass="h-[60%] w-14 mr-2"
				on:click={() => (selectedUnStakeAmount = maxUnstakeAmount)}
				disabled={parseEther(maxUnstakeAmount || '0').eq(parseEther('0'))}
			>
				MAX
			</PrimaryButton>
		</Input>
	</div>

	<div>
		<PrimaryButton
			disabled={ethers.utils.parseEther(selectedUnStakeAmount || '0').eq(parseEther('0')) ||
				+selectedUnStakeAmount > +maxUnstakeAmount}
			on:click={triggerUnstakeTokens}
		>
			Unstake
		</PrimaryButton>
	</div>
</div>
<!-- 
<div class="flex-grow mt-4">
	Max Unstake: {maxUnstakeAmount}
</div> -->

<div class="text-lg mt-5 grid grid-cols-3">
	<div class="title">Positions</div>
	{#if highlightUnstakeItems}
		<div class="text-sm">Please Select a Position</div>
	{/if}
</div>

<PositionsTable
	positions={$userStakes}
	on:unstake-tokens={triggerUnstakeUI}
	highlightItems={highlightUnstakeItems}
/>

<div class="text-lg mt-4">Rewards</div>

<RewardsTable rewards={$claimableHinataStakingRewards} />
