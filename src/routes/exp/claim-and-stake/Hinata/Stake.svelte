<script lang="ts">
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import StakeDurationSwitch from './StakeDurationSwitch.svelte';
	import PositionsTable from './PositionsTable.svelte';
	import RewardsTable from './RewardsTable.svelte';
	import WalletBalance from './WalletBalance.svelte';
	import { claimableHinataStakingRewards, userStakes, walletHinataBalance } from '$stores/wallet';
	import { stakeDurations, stakeTokens } from '$utils/contracts/staking';
	import { createEventDispatcher } from 'svelte';
	import { ethers } from 'ethers';
	import { ethAmountRegex, regexFilter } from '$actions/regexFilter';

	let selectedStakeDuration = stakeDurations[0];
	let selectedStakeAmount: string = null;

	const dispatch = createEventDispatcher();

	async function triggerStakeTokens() {
		await stakeTokens(selectedStakeAmount, selectedStakeDuration.value);
		dispatch('reload-stake-data');
	}

	function validateStakeAmount(amount: string) {
		if (!amount) {
			return false;
		}

		// using ethers to perform the comparison since there are rounding errors
		return (
			ethers.utils.parseEther(amount || '0').eq(ethers.utils.parseEther('0')) ||
			ethers.utils.parseEther(amount || '0').lte(ethers.utils.parseEther($walletHinataBalance))
		);
	}

	$: isBalanceSufficient = validateStakeAmount(selectedStakeAmount);

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
		<!-- Stake amount input -->
		<div
			class="border-2 border-white relative h-12"
			class:border-red-400={!isBalanceSufficient && selectedStakeAmount}
		>
			<input
				bind:value={selectedStakeAmount}
				use:regexFilter={{ regex: ethAmountRegex }}
				inputmode="numeric"
				placeholder="Enter Amount"
				class="bg-transparent w-full h-full p-4 outline-none"
			/>

			<div class="absolute right-0 top-0 bottom-0 grid place-items-center">
				<PrimaryButton
					extButtonClass="h-[60%] w-14 mr-2"
					on:click={() => (selectedStakeAmount = $walletHinataBalance)}
				>
					MAX
				</PrimaryButton>
			</div>
		</div>
	</div>

	<div>
		<PrimaryButton
			disabled={(false &&
				ethers.utils.parseEther(selectedStakeAmount || '0').eq(ethers.utils.parseEther('0'))) ||
				+selectedStakeAmount > +$walletHinataBalance}
			on:click={triggerStakeTokens}
		>
			Stake
		</PrimaryButton>
	</div>
</div>

<WalletBalance walletBalance={$walletHinataBalance.toString()} />

{#if $userStakes.length > 0}
	<div class="mt-4 text-lg">Positions</div>

	<div class="mt-4">
		<PositionsTable positions={$userStakes} on:unstake-tokens={triggerUnstakeUI} />
	</div>
{/if}

<div class="mt-4 text-lg">Rewards</div>

<div class="mt-4">
	<RewardsTable rewards={$claimableHinataStakingRewards} />
</div>
