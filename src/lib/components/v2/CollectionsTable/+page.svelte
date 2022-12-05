<script lang="ts">
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { compactNumberFormat } from '$utils/api';
	import type { Collection } from '$utils/api/collection';
	import { createEventDispatcher } from 'svelte';
	import { inview } from 'svelte-inview';
	import CollectionNfTsPreview from './CollectionNFTsPreview.svelte';

	export let collections: Collection[];
	export let isLoading = false;
	const dispatch = createEventDispatcher();

	const inviewOptions = {};

	function onChange(event) {
		if (event.detail.inView) {
			dispatch('end-reached');
		}
	}
</script>

<table class="min-w-full text-xs 2xl:text-base leading-5 2xl:leading-6 font-medium">
	<thead>
		<tr>
			<th scope="col" class="text-left whitespace-nowrap">Collection</th>
			<th scope="col" class="text-left whitespace-nowrap">Total Volume</th>
			<th scope="col" class="text-left whitespace-nowrap">Floor Price</th>
			<th scope="col" class="text-left whitespace-nowrap">
				<span class="sr-only">NFTs</span>
			</th>
		</tr>
	</thead>
	<tbody>
		{#if collections?.length > 0}
			{#each collections as collection}
				<tr class="">
					<td class="whitespace-nowrap">
						<a class="w-full" href="/collections/{collection?.slug}">
							{collection?.name}
						</a>
					</td>
					<td class=" gap-x-1.5">
						{compactNumberFormat(collection?.totalVol || 0)}
						<span class="text-[10px] 2xl:text-xs text-opacity-70">ETH</span>
					</td>
					<td class=" gap-x-1.5">
						{compactNumberFormat(collection?.floorPrice || 0)}
						<span class="text-[10px] 2xl:text-xs text-opacity-70">ETH</span>
					</td>
					<td class="w-[413px] 2xl:w-[515px]">
						<!-- <div class="h-16 w-[413px] bg-gray-50" /> -->
						<CollectionNfTsPreview collectionSlug={collection?.slug} />
					</td>
				</tr>
			{/each}
		{:else if collections?.length === 0 && !isLoading}
			<tr class="cols-5 w-full flex items-center justify-center text-lg py-20">No collections found.</tr>
		{/if}
	</tbody>
</table>
{#if isLoading}
	<DiamondsLoader />
{:else}
	<div use:inview={inviewOptions} on:change={onChange} />
{/if}
