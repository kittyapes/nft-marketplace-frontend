<script lang="ts">
	import HinataBadge from '$icons/hinata-badge.svelte';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { apiSearchCollections, type CollectionTableRow } from '$utils/api/collection';
	import { onMount } from 'svelte';
	let limit = 0;
	let page = 0;
	let collections: CollectionTableRow[] = [];

	let fetchingCollections = false;
	onMount(async () => {
		await loadCollections();
	});
	const loadCollections = async () => {
		console.log('Loading');
		fetchingCollections = true;
		limit += 10;
		page++;
		const leadedCollections = (await apiSearchCollections({ limit, page })).collections;
		collections = [...collections, ...leadedCollections];
		fetchingCollections = false;
	};
</script>

{#if collections?.length > 0}
	<div class="flex flex-col gap-y-8 2xl:gap-y-10">
		{#each collections as collection, i}
			<button class="flex flex-row items-center gap-x-4 2xl:gap-x-6 font-bold text-white text-xs 2xl:text-sm leading-5 2xl:leading-7 ">
				<div class="relative w-14 2xl:w-[70px] h-14 2xl:h-[70px] border-gradient thumbnail bg-cover bg-center" style="--url: url({collection?.logoImageUrl ?? ''})">
					<HinataBadge class="absolute -bottom-2.5 -right-2.5 z-10  w-5 h-5 {!collection?.verified ? 'hidden' : ''}" />
				</div>
				<div class="flex-grow whitespace-nowrap truncate">
					<div class="flex flex-row items-center justify-between">
						<h2>{collection?.name}</h2>
						<h2>{collection?.totalVol} ETH</h2>
					</div>
					<div class="flex flex-row items-center justify-between font-semibold leading-7 2xl:leading-9 text-[#CECECE]">
						<h3 class="">Floor: {collection.floorPrice} ETH</h3>
						<h3 class="">
							${collection.total24hours}K
							{#if collection?.['24hourPercent'] > 0}
								<span class="text-[#6FCF97]">{collection?.['24hourPercent']}%</span>
							{:else if collection?.['24hourPercent'] < 0}
								<span class="text-[#EB5757]">{collection?.['24hourPercent']}%</span>
							{/if}
						</h3>
					</div>
				</div>
			</button>
		{/each}
	</div>
{/if}

{#if fetchingCollections}
	<DiamondsLoader />
{/if}
{#if collections?.length > 0}
	<button on:click={async () => await loadCollections()} class="w-full flex items-center justify-center bg-gradient-a border-gradient h-11 2xl:h-14 mt-7 2xl:mt-9">Load more</button>
{/if}

<style lang="postcss">
	.thumbnail {
		background-image: var(--url);
	}
</style>
