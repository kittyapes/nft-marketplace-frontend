<script lang="ts">
	import BorderlessButton from '$lib/components/v2/BorderlessButton/BorderlessButton.svelte';
	import { stakeDurations } from '$utils/contracts/staking';

	export let selectedStakeDuration = stakeDurations[0];
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
