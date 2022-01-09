<script lang="ts">
	import NftCard from './NftCard.svelte';

	export let promise: Promise<NftData[]>;
</script>

{#await promise}
	<div class="placeholder">Loading...</div>
{:then nfts}
	{#if nfts.length}
		<div
			class="grid gap-4 p-8 justify-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-full"
		>
			{#each nfts as data}
				<NftCard {data} />
			{/each}
		</div>
	{:else}
		<div class="placeholder">Nothing to see here, move along.</div>
	{/if}
{/await}

<style>
	.placeholder {
		@apply p-36 font-semibold text-lg opacity-60;
	}
</style>
