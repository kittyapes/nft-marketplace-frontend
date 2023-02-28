<script>
	import Info from '$icons/info.v2.svelte';
	import TextInput from '$lib/components/v2/TextInput/TextInput.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import StakeDurationSwitch from './StakeDurationSwitch.svelte';
	import Table from './Table.svelte';

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
		<TextInput placeholder="Max" />
	</div>

	<div>
		<PrimaryButton>Stake</PrimaryButton>
	</div>
</div>

<div class="mt-4 text-lg">
	<span class="text-gradient">$HINATA Wallet Balance:</span>
	{1234}
</div>

<div class="text-lg mt-4">Positions</div>

<div class="mt-4">
	<Table>
		<div slot="headers">
			<div>Time Left</div>
			<div>Amount</div>
			<div>APY</div>
		</div>

		<div slot="data">
			{#each mockPositions as pos}
				<div>
					{#if pos.unstakeAvailable}
						<button class="--action-btn-gradient px-2 text-lg btn">Unstake</button>
					{:else}
						{pos.timeLeft}
					{/if}
				</div>
				<div>{pos.amount}</div>
				<div>{pos.APY}</div>
			{/each}
		</div>
	</Table>
</div>

<div class="text-lg mt-4">Rewards</div>

<div class="mt-4">
	<Table>
		<div slot="headers">
			<div>Token</div>
			<div>Amount</div>
			<div>Action</div>
		</div>

		<div slot="data">
			{#each mockRewards as reward}
				<div>
					{reward.token}
				</div>
				<div>{reward.amount}</div>
				<div>
					<button class="--action-btn-gradient px-4 btn">Claim</button>
				</div>
			{/each}
		</div>
	</Table>
</div>

<style>
	.--action-btn-gradient {
		background: linear-gradient(
				56.67deg,
				rgba(167, 148, 255, 0) 11.15%,
				rgba(167, 148, 255, 0.93) 57.47%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(167, 148, 255, 0) 127.41%
			),
			#67d4f8;
	}
</style>
