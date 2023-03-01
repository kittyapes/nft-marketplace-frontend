<script lang="ts">
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import TextInput from '$lib/components/v2/TextInput/TextInput.svelte';
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

<div class="text-lg mt-4">Positions</div>

<PositionsTable positions={mockPositions} />

<div class="text-lg mt-4">Rewards</div>

<RewardsTable rewards={mockRewards} />

<!-- Unstake amount input field -->
<div class="flex gap-x-4 mt-4">
	<div class="flex-grow">
		<TextInput placeholder="Max" />
	</div>

	<div>
		<PrimaryButton>Stake</PrimaryButton>
	</div>
</div>

<WalletBalance />
