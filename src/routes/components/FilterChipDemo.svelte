<script>
	import FilterChip from '$lib/components/v2/FilterChip/FilterChip.svelte';

	let clicks = 0;
</script>

<FilterChip text="FilterChip" on:cross-click={() => clicks++} />

<span class="ml-2">
	Clicks: {clicks}
</span>
