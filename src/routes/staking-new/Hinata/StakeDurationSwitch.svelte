<script lang="ts">
	import BorderlessButton from '$lib/components/v2/BorderlessButton/BorderlessButton.svelte';

	const stakeDurations = [
		{ id: '3m', label: '3 Months' },
		{ id: '6m', label: '6 Months' },
		{ id: '1y', label: '1 Year' },
	];

	let selectedStakeDuration = stakeDurations[0];
</script>

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
