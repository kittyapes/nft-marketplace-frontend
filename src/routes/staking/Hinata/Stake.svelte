<script lang="ts">
	import TextInput from '$lib/components/v2/TextInput/TextInput.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import StakeDurationSwitch from './StakeDurationSwitch.svelte';
	import PositionsTable from './PositionsTable.svelte';
	import RewardsTable from './RewardsTable.svelte';
	import WalletBalance from './WalletBalance.svelte';
	import { claimableHinataStakingRewards, userStakes, walletHinataBalance } from '$stores/wallet';
	import { stakeDurations, stakeTokens } from '$utils/contracts/staking';
	import { createEventDispatcher } from 'svelte';
	// import Info from '$icons/info.v2.svelte';

	$: selectedStakeDuration = stakeDurations[0];
	$: selectedStakeAmount = '0';

	const dispatch = createEventDispatcher();

	async function triggerStakeTokens() {
		await stakeTokens(selectedStakeAmount, selectedStakeDuration.value);
		dispatch('reload-stake-data');
	}

	function validateStakeAmount(amount: string) {
		return parseFloat(amount) < +$walletHinataBalance;
	}

	function triggerUnstakeUI(event: { detail: { stakeId: number; amount: string } }) {
		dispatch('unstake-tokens', event.detail);
	}
</script>

<!-- <div class="flex items-center w-full mt-4 gap-x-4">
	<PrimaryButton>Compound</PrimaryButton>

	<div class="flex-shrink-0">
		<Info />
	</div>
</div> -->

<StakeDurationSwitch {selectedStakeDuration} />

<!-- Stake amount input field -->
<div class="flex mt-4 gap-x-4">
	<div class="flex-grow">
		<TextInput
			bind:value={selectedStakeAmount}
			validator={validateStakeAmount}
			placeholder="Enter Amount"
		/>
	</div>

	<div>
		<PrimaryButton
			disabled={parseFloat(selectedStakeAmount) === 0 ||
				parseFloat(selectedStakeAmount) > +$walletHinataBalance}
			on:click={triggerStakeTokens}
		>
			Stake
		</PrimaryButton>
	</div>
</div>

<WalletBalance walletBalance={$walletHinataBalance.toString()} />

<div class="mt-4 text-lg">Positions</div>

<div class="mt-4">
	<PositionsTable positions={$userStakes} on:unstake-tokens={triggerUnstakeUI} />
</div>

<div class="mt-4 text-lg">Rewards</div>

<div class="mt-4">
	<RewardsTable rewards={$claimableHinataStakingRewards} />
</div>
