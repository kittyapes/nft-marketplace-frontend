<script lang="ts">
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import TextInput from '$lib/components/v2/TextInput/TextInput.svelte';
	import { userStakes } from '$stores/wallet';
	import { withdrawUnlockedTokensByStakeId } from '$utils/contracts/staking';
	import { createEventDispatcher } from 'svelte';
	import PositionsTable from './PositionsTable.svelte';
	import RewardsTable from './RewardsTable.svelte';

	const mockRewards = [
		{ token: '25 days', amount: '2', APY: '129.12%' },
		{ token: '25 days', amount: '2', APY: '129.12%' },
		{ token: '25 days', amount: '2', APY: '129.12%' },
	];

	const dispatch = createEventDispatcher();

	export let maxUnstakeAmount = '0';
	export let unstakeId = 1;

	$: selectedUnStakeAmount = '0';

	function validateStakeAmount(amount: string) {
		return parseFloat(amount) < +maxUnstakeAmount;
	}

	async function triggerUnstakeTokens() {
		await withdrawUnlockedTokensByStakeId(unstakeId, parseFloat(selectedUnStakeAmount));
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
			validator={validateStakeAmount}
		/>
	</div>

	<div>
		<PrimaryButton
			disabled={parseFloat(selectedUnStakeAmount) === 0 ||
				parseFloat(selectedUnStakeAmount) > +maxUnstakeAmount}
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

<RewardsTable rewards={mockRewards} />
