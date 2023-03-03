<script lang="ts">
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import TextInput from '$lib/components/v2/TextInput/TextInput.svelte';
	import { claimableHinataStakingRewards, userStakes } from '$stores/wallet';
	import { withdrawUnlockedTokensByStakeId } from '$utils/contracts/staking';
	import { createEventDispatcher } from 'svelte';
	import PositionsTable from './PositionsTable.svelte';
	import RewardsTable from './RewardsTable.svelte';

	const dispatch = createEventDispatcher();

	export let maxUnstakeAmount = '0';
	export let unstakeId = 1;

	$: selectedUnStakeAmount = '0';

	function validateUnstakeAmount(amount: string) {
		return amount === '0' || +amount <= +maxUnstakeAmount;
	}

	async function triggerUnstakeTokens() {
		await withdrawUnlockedTokensByStakeId(unstakeId, selectedUnStakeAmount);
		dispatch('reload-stake-data');
	}

	function triggerUnstakeUI(event: { detail: { stakeId: number; amount: string } }) {
		dispatch('unstake-tokens', event.detail);
	}
</script>

<!-- Unstake amount input field -->
<div class="flex gap-x-4 mt-5">
	<div class="flex-grow">
		<TextInput
			placeholder="Enter Amount to Unstake"
			bind:value={selectedUnStakeAmount}
			validator={validateUnstakeAmount}
		/>
	</div>

	<div>
		<PrimaryButton
			disabled={+selectedUnStakeAmount === 0 || +selectedUnStakeAmount > +maxUnstakeAmount}
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

<PositionsTable positions={$userStakes} on:unstake-tokens={triggerUnstakeUI} />

<div class="text-lg mt-4">Rewards</div>

<RewardsTable rewards={$claimableHinataStakingRewards} />
