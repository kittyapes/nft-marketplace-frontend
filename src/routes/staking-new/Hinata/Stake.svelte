<script>
	import Info from '$icons/info.v2.svelte';
	import TextInput from '$lib/components/v2/TextInput/TextInput.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import StakeDurationSwitch from './StakeDurationSwitch.svelte';
	import PositionsTable from './PositionsTable.svelte';
	import RewardsTable from './RewardsTable.svelte';
	import WalletBalance from './WalletBalance.svelte';

	const mockPositions = [
		{ timeLeft: '25 days', amount: '2', APY: '129.12%', unstakeAvailable: false },
		{ timeLeft: '25 days', amount: '2', APY: '129.12%', unstakeAvailable: false },
		{ timeLeft: '25 days', amount: '2', APY: '129.12%', unstakeAvailable: true },
	];

	const mockRewards = [
		{ token: '25 days', amount: '2', APY: '129.12%' },
		{ token: '25 days', amount: '2', APY: '129.12%' },
		{ token: '25 days', amount: '2', APY: '129.12%' },
	];
</script>

<div class="w-full mt-4 flex items-center gap-x-4">
	<PrimaryButton>Compound</PrimaryButton>

	<div class="flex-shrink-0">
		<Info />
	</div>
</div>

<StakeDurationSwitch />

<!-- Stake amount input field -->
<div class="flex gap-x-4 mt-4">
	<div class="flex-grow">
		<TextInput placeholder="Enter Amount" />
	</div>

	<div>
		<PrimaryButton>Stake</PrimaryButton>
	</div>
</div>

<WalletBalance />

<div class="text-lg mt-4">Positions</div>

<div class="mt-4">
	<PositionsTable positions={mockPositions} />
</div>

<div class="text-lg mt-4">Rewards</div>

<div class="mt-4">
	<RewardsTable rewards={mockRewards} />
</div>
