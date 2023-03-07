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
	import Input from '$lib/components/v2/Input/Input.svelte';
	import { ethers } from 'ethers';
	// import Info from '$icons/info.v2.svelte';

	$: selectedStakeDuration = stakeDurations[0];
	$: selectedStakeAmount = '';

	const dispatch = createEventDispatcher();

	async function triggerStakeTokens() {
		await stakeTokens(selectedStakeAmount, selectedStakeDuration.value);
		dispatch('reload-stake-data');
	}

	function validateStakeAmount(amount: string) {
		// using ethers to perform the comparison since there are rounding errors
		return (
			ethers.utils.parseEther(amount || '0').eq(ethers.utils.parseEther('0')) ||
			ethers.utils.parseEther(amount || '0').lte(ethers.utils.parseEther($walletHinataBalance))
		);
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
		<Input
			bind:value={selectedStakeAmount}
			validator={validateStakeAmount}
			placeholder="Enter Amount"
			inputMode="numeric"
			class={`border-2 border-white rounded-none h-12 section-subtext hover:border-color-purple ${
				(ethers.utils.parseEther(selectedStakeAmount || '0').eq(ethers.utils.parseEther('0')) ||
					!validateStakeAmount(selectedStakeAmount)) &&
				'border-white hover:border-white opacity-50'
			}`}
		>
			<PrimaryButton
				slot="end-icon"
				extButtonClass="h-[60%] w-14 mr-2"
				on:click={() => (selectedStakeAmount = $walletHinataBalance)}
			>
				MAX
			</PrimaryButton>
		</Input>
	</div>

	<div>
		<PrimaryButton
			disabled={ethers.utils
				.parseEther(selectedStakeAmount || '0')
				.eq(ethers.utils.parseEther('0')) ||
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
