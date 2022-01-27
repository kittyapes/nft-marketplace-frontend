<script>
	import StatusFilterButton from '../marketplace/StatusFilterButton.svelte';
	const SORT_BY = ['Raffle', 'Auction', 'Limited', 'Queue Drop', 'WAIFU', 'Generative'];
</script>

<div class="flex flex-wrap gap-2">
	{#each SORT_BY as st, i}
		<StatusFilterButton value={st} />
	{/each}
</div>
