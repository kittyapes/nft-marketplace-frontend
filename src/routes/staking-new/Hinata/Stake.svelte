<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import TextInput from '$lib/components/v2/TextInput/TextInput.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import StakeDurationSwitch from './StakeDurationSwitch.svelte';
	import PositionsTable from './PositionsTable.svelte';
	import RewardsTable from './RewardsTable.svelte';
	import WalletBalance from './WalletBalance.svelte';
	import {
		calculateApr,
		getUserStakes,
		lastTimeRewardWouldBeApplied,
		stakeDurations,
		stakeTokens,
	} from '$utils/contracts/staking';
	import { onMount } from 'svelte';
	import { getTokenBalance } from '$utils/contracts/token';
	import { getContract } from '$utils/misc/getContract';
	import { currentUserAddress } from '$stores/wallet';
	import { ethers } from 'ethers';

	let userStakes: {
		endTime: number;
		amount: number;
		aprOrApy: number;
		interestType: 'apy' | 'apr';
		unstakeAvailable: boolean;
	}[] = [];

	const mockRewards = [
		{ token: 'Hinata', amount: '2', APY: '129.12%' },
		{ token: 'Hinata', amount: '2', APY: '129.12%' },
		{ token: 'Hinata', amount: '2', APY: '129.12%' },
	];

	$: selectedStakeDuration = stakeDurations[0];
	$: selectedStakeAmount = '0';

	$: walletHinataBalance = 0;

	async function loadUp() {
		walletHinataBalance = +ethers.utils.formatEther(
			await getTokenBalance(getContract('hinata-token').address, $currentUserAddress, 18),
		);

		const addressStakes = await getUserStakes($currentUserAddress);

		const lastTimeRewardApplied = await lastTimeRewardWouldBeApplied();

		userStakes = [];
		addressStakes.map((item) => {
			const dateDifference = (lastTimeRewardApplied - item.lockedAt) / (3600 * 24);

			userStakes.push({
				amount: item.amount,
				endTime: 1000 * (item.lockedAt + item.lockPeriod),
				interestType: 'apr',
				aprOrApy: calculateApr(item.reward, 0, item.amount, dateDifference),
				unstakeAvailable: Date.now() > 1000 * (item.lockedAt + item.lockPeriod),
			});
		});
	}

	onMount(async () => {
		await loadUp();
	});

	async function triggerStakeTokens() {
		await stakeTokens(parseFloat(selectedStakeAmount), selectedStakeDuration.value);
		await loadUp();
	}

	function validateStakeAmount(amount: string) {
		return parseFloat(amount) < walletHinataBalance;
	}

	currentUserAddress.subscribe(async (address) => {
		await loadUp();
	});
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
				parseFloat(selectedStakeAmount) > walletHinataBalance}
			on:click={triggerStakeTokens}
		>
			Stake
		</PrimaryButton>
	</div>
</div>

<WalletBalance walletBalance={walletHinataBalance.toString()} />

<div class="mt-4 text-lg">Positions</div>

<div class="mt-4">
	<PositionsTable positions={userStakes} />
</div>

<div class="mt-4 text-lg">Rewards</div>

<div class="mt-4">
	<RewardsTable rewards={mockRewards} />
</div>
