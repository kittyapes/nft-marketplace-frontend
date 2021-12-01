<script lang="ts">
	import type { NftData } from '$lib/data/nft';
	import NftCard from './NftCard.svelte';

	export let promise: Promise<NftData[]>;
</script>

<div
	class="grid gap-4 p-8 justify-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-full"
>
	{#await promise}
		Loading...
	{:then nfts}
		{#each nfts as data}
			<NftCard {data} />
		{/each}
	{/await}
</div>
