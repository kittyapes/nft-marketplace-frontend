<script lang="ts">
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { claimableHinataStakingRewards, userStakes } from '$stores/wallet';
	import { withdrawUnlockedTokensByStakeId } from '$utils/contracts/staking';
	import { createEventDispatcher } from 'svelte';
	import PositionsTable from './PositionsTable.svelte';
	import RewardsTable from './RewardsTable.svelte';
	import { ethers } from 'ethers';
	import { ethAmountRegex, regexFilter } from '$actions/regexFilter';

	const { parseEther } = ethers.utils;

	const dispatch = createEventDispatcher();

	export let maxUnstakeAmount = '0';
	export let unstakeId = 1;
	export let selectedUnstakeAmount: number = null;

	$: stringUnstakeAmount = selectedUnstakeAmount?.toString() || '0';

	$: highlightUnstakeItems = false;
	$: userClickedOnInput = false;

	function validateUnstakeAmount(amount: string) {
		userClickedOnInput = false;
		return (
			parseEther(stringUnstakeAmount || '0').eq(parseEther('0')) ||
			parseEther(amount).lte(parseEther(maxUnstakeAmount))
		);
	}

	async function triggerUnstakeTokens() {
		await withdrawUnlockedTokensByStakeId(unstakeId, stringUnstakeAmount);
		dispatch('reload-stake-data');
	}

	function triggerUnstakeUI(event: { detail: { stakeId: number; amount: string } }) {
		dispatch('unstake-tokens', event.detail);
	}

	function highlightUnstake() {
		if (
			$userStakes.length > 0 &&
			parseEther(maxUnstakeAmount || '0').eq(parseEther('0')) &&
			!userClickedOnInput
		) {
			highlightUnstakeItems = true;
			userClickedOnInput = true;
		}
	}

	$: if (!parseEther(maxUnstakeAmount || '0').eq(parseEther('0')) && userClickedOnInput) {
		highlightUnstakeItems = false;
		userClickedOnInput = false;
	}

	$: isUnstakeAmountValid = validateUnstakeAmount(stringUnstakeAmount);
</script>

<!-- Unstake amount input field -->
<div class="flex gap-x-4 mt-5">
	<div class="flex-grow">
		<!-- Unstake amount input -->
		<div
			class="border-2 border-white relative h-12"
			class:border-red-400={!isUnstakeAmountValid && stringUnstakeAmount}
		>
			<input
				bind:value={selectedUnstakeAmount}
				use:regexFilter={{ regex: ethAmountRegex }}
				type="number"
				placeholder="Enter Amount"
				class="bg-transparent w-full h-full p-4 outline-none"
				on:click={highlightUnstake}
			/>

			<div class="absolute right-0 top-0 bottom-0 grid place-items-center">
				<PrimaryButton
					extButtonClass="h-[60%] w-14 mr-2"
					on:click={() => (selectedUnstakeAmount = parseFloat(maxUnstakeAmount))}
					disabled={parseEther(maxUnstakeAmount || '0').eq(parseEther('0'))}
				>
					MAX
				</PrimaryButton>
			</div>
		</div>
	</div>

	<div>
		<PrimaryButton
			disabled={ethers.utils.parseEther(stringUnstakeAmount || '0').eq(parseEther('0')) ||
				selectedUnstakeAmount > +maxUnstakeAmount}
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

{#if $userStakes.length > 0}
	<div class="text-lg mt-5 grid grid-cols-3">
		<div class="title">Positions</div>
		{#if highlightUnstakeItems}
			<div class="text-xs flex items-center justify-center pt-1">Please Select a Position</div>
		{/if}
	</div>

	<PositionsTable
		positions={$userStakes}
		on:unstake-tokens={triggerUnstakeUI}
		highlightItems={highlightUnstakeItems}
	/>
{/if}

<div class="text-lg mt-4">Rewards</div>

<RewardsTable rewards={$claimableHinataStakingRewards} />
