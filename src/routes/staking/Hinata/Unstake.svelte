<script lang="ts">
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import TextInput from '$lib/components/v2/TextInput/TextInput.svelte';
	import { claimableHinataStakingRewards, userStakes } from '$stores/wallet';
	import { withdrawUnlockedTokensByStakeId } from '$utils/contracts/staking';
	import { createEventDispatcher } from 'svelte';
	import PositionsTable from './PositionsTable.svelte';
	import RewardsTable from './RewardsTable.svelte';
	import Input from '$lib/components/v2/Input/Input.svelte';
	import { ethers } from 'ethers';

	const dispatch = createEventDispatcher();

	export let maxUnstakeAmount = '0';
	export let unstakeId = 1;

	$: selectedUnStakeAmount = '0';
	$: highlightUnstakeItems = false;

	function validateUnstakeAmount(amount: string) {
		return (
			ethers.utils.parseEther(selectedUnStakeAmount || '0').eq(ethers.utils.parseEther('0')) ||
			ethers.utils.parseEther(amount).lte(ethers.utils.parseEther(maxUnstakeAmount))
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
		if (ethers.utils.parseEther(maxUnstakeAmount || '0').eq(ethers.utils.parseEther('0'))) {
			highlightUnstakeItems = true;
			setTimeout(() => (highlightUnstakeItems = false), 800);
		}
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
				(ethers.utils.parseEther(selectedUnStakeAmount || '0').eq(ethers.utils.parseEther('0')) ||
					!validateUnstakeAmount(selectedUnStakeAmount)) &&
				'border-white hover:border-white opacity-50'
			}`}
			on:click={highlightUnstake}
		>
			<PrimaryButton
				slot="end-icon"
				extButtonClass="h-[60%] w-14 mr-2"
				on:click={() => (selectedUnStakeAmount = maxUnstakeAmount)}
				disabled={ethers.utils.parseEther(maxUnstakeAmount || '0').eq(ethers.utils.parseEther('0'))}
			>
				MAX
			</PrimaryButton>
		</Input>
	</div>

	<div>
		<PrimaryButton
			disabled={ethers.utils
				.parseEther(selectedUnStakeAmount || '0')
				.eq(ethers.utils.parseEther('0')) || +selectedUnStakeAmount > +maxUnstakeAmount}
			on:click={triggerUnstakeTokens}
		>
			Unstake
		</PrimaryButton>
	</div>
</div>

<div class="flex-grow mt-4">
	Max Unstake: {maxUnstakeAmount}
</div>

<div class="text-lg mt-4">Positions</div>

<PositionsTable
	positions={$userStakes}
	on:unstake-tokens={triggerUnstakeUI}
	highlightItems={highlightUnstakeItems}
/>

<div class="text-lg mt-4">Rewards</div>

<RewardsTable rewards={$claimableHinataStakingRewards} />
