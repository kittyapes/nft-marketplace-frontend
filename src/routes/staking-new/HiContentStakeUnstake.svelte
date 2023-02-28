<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import TextInput from '$lib/components/v2/TextInput/TextInput.svelte';
	import BorderlessButton from '$lib/components/v2/BorderlessButton/BorderlessButton.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';

	let stakeUnstake: 'stake' | 'unstake' = 'stake';
	let stakeDuration: '3 Months' | '6 Months' | '1 Year';

	const stakeDurations = [
		{ id: '3m', label: '3 Months' },
		{ id: '6m', label: '6 Months' },
		{ id: '1y', label: '1 Year' },
	];

	let selectedStakeDuration = stakeDurations[0];
</script>

<div class="flex-grow">
	<div class="text-lg">Your Stake</div>

	<div class="w-full mt-4 flex items-center gap-x-4">
		<PrimaryButton>Compound</PrimaryButton>

		<div class="flex-shrink-0">
			<Info />
		</div>
	</div>

	<!-- Stake unstake switch -->
	<div class="grid grid-cols-2 w-full mt-4">
		<BorderlessButton on:click={() => (stakeUnstake = 'stake')} selected={stakeUnstake === 'stake'}>
			Stake
		</BorderlessButton>

		<BorderlessButton
			on:click={() => (stakeUnstake = 'unstake')}
			selected={stakeUnstake === 'unstake'}
		>
			Unstake
		</BorderlessButton>
	</div>

	<!-- Stake duration -->
	<div class="grid grid-cols-3 mt-4">
		{#each stakeDurations as stakeDuration}
			<BorderlessButton
				on:click={() => (selectedStakeDuration = stakeDuration)}
				selected={selectedStakeDuration === stakeDuration}
			>
				{stakeDuration.label}
			</BorderlessButton>
		{/each}
	</div>

	<div class="flex gap-x-4 mt-4">
		<div class="flex-grow">
			<TextInput placeholder="Max" />
		</div>

		<div>
			<PrimaryButton>Stake</PrimaryButton>
		</div>
	</div>
</div>
