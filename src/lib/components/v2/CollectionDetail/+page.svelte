<script lang="ts">
	import type { Collection } from '$utils/api/collection';
	import Button from '$lib/components/Button.svelte';
	import NftGrid from '$components/v2/NFTGrid/+page.svelte';
	import CollectionValues from './CollectionValues.svelte';
	import CollectionIdentity from './CollectionIdentity.svelte';
	import CollectionDescription from './CollectionDescription.svelte';
	import { createEventDispatcher } from 'svelte';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { filterNfts } from '$utils/nfts/search';
	import FilterAndGrid from './FilterAndGrid.svelte';

	const dispatch = createEventDispatcher();

	export let collectionData: Collection;
	export let nfts = [];
	export let displayedNfts = [];
	export let isLoading: boolean;
	export let reachedEnd: boolean;

	let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';

	let searchPhrase: string;

	$: if (searchPhrase) {
		displayedNfts = filterNfts(nfts, searchPhrase.toLocaleUpperCase());
	} else {
		displayedNfts = nfts;
	}
</script>

<main class="px-36 pt-24 mx-auto text-white">
	<div class="w-full overflow-hidden h-96">
		{#if collectionData?.backgroundImageUrl}
			<img class="w-full h-full object-cover object-center" src={collectionData?.backgroundImageUrl} alt="Collection cover." />
		{:else}
			<div class="w-full h-full bg-gray-100" />
		{/if}
	</div>

	<div class="w-full flex flex-row flex-wrap overflow-auto gap-y-5 items-center justify-between mt-12">
		<CollectionIdentity bind:collectionData />
		<CollectionValues bind:collectionData />
	</div>

	<!-- Description -->
	<CollectionDescription bind:collectionData />

	<!-- Filter and grid selection-->
	<FilterAndGrid bind:searchPhrase bind:gridStyle bind:nfts />

	<!-- Filter panel and NFT grid -->
	<div class="w-full flex flex-row items-start gap-x-5 mt-6 ">
		<div class="w-full">
			<NftGrid bind:options={displayedNfts} bind:gridStyle bind:reachedEnd bind:isLoading />

			{#if isLoading}
				<DiamondsLoader />
			{/if}

			{#if nfts?.length > 0 && !reachedEnd}
				<Button
					on:click={() => {
						dispatch('load-more');
					}}
					stretch
					class="bg-gradient-a border-gradient h-14 mt-16 mb-20"
				>
					Load more
				</Button>
			{/if}
		</div>
	</div>
</main>
