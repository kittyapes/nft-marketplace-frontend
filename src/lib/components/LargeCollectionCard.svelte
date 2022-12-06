<script lang="ts">
	import { apiGetCollectionBySlug, type Collection } from '$utils/api/collection';
	import { onMount } from 'svelte';
	import DiamondsLoader from './DiamondsLoader.svelte';
	import { goto } from '$app/navigation';

	export let collection: Collection;

	let collectionDetail: Collection;
	let isLoading = true;

	onMount(async () => {
		isLoading = true;
		collectionDetail = await apiGetCollectionBySlug(collection.slug);
		isLoading = false;
	});
</script>

<div
	class="relative px-6 py-4 border border-color-gray-base border-opacity-50 rounded-xl flex flex-col gap-4 clickable min-w-[42rem] max-w-min"
	on:click={() => goto('/collections/' + collection.slug)}
>
	<div class="flex flex-row gap-4">
		<div class="bg-color-gray-base bg-opacity-30 w-14 h-14 rounded-full grid place-items-center">
			<img
				src={collection.logoImageUrl ||
					'https://media.istockphoto.com/photos/abstract-geometric-network-polygon-globe-graphic-background-picture-id1208738316?b=1&k=20&m=1208738316&s=170667a&w=0&h=f4KWULKjL770nceDM6xi32EbfIgMtBwSp5fPxIx08wc='}
				alt="Collection Logo."
				class="w-12 h-12 rounded-full object-cover absolute"
			/>
		</div>
		<div class="flex flex-col">
			<div class="font-semibold text-lg">
				{#if collection.name?.length > 25}
					{collection.name.slice(0, 25)}...
				{:else}
					{collection.name}
				{/if}
			</div>
			<div class="font-medium text-color-gradient max-w-max font-poppins">@{collection.creator}</div>
		</div>
	</div>
	<div class="border-b border-color-gray-light" />
	<div class="flex justify-between items-center">
		<div class="flex flex-col text-center">
			<div class="text-xs">Highest Sale</div>
			<div class="text-lg font-semibold">{collection.highestSale || 0} WETH</div>
		</div>
		<div class="flex flex-col text-center">
			<div class="text-xs">Floor Price</div>
			<div class="text-lg font-semibold">{collection.floorPrice || 0} WETH</div>
		</div>
		<div class="flex flex-col text-center">
			<div class="text-xs">Total Volume</div>
			<div class="text-lg font-semibold">{collection.totalVol || 0} WETH</div>
		</div>
		<div class="flex flex-col text-center">
			<div class="text-xs">Items</div>
			<div class="text-lg font-semibold">{collection.items || 0}</div>
		</div>
		<div class="flex flex-col text-center">
			<div class="text-xs">Owners</div>
			<div class="text-lg font-semibold">{collection.owners || 0}</div>
		</div>
		<div class="flex flex-col text-center">
			<div class="text-xs">24hr Volume</div>
			<div class="text-lg font-semibold">{collection.total24hours || 0} WETH</div>
		</div>
	</div>
	<div class="flex items-center justify-center gap-4">
		{#if !isLoading && collectionDetail && collectionDetail.nfts?.length}
			{#each collectionDetail.nfts?.slice(0, 4) as nft}
				{#if nft.thumbnailUrl}
					<img class="object-cover w-28 h-28 rounded-md" src={nft.thumbnailUrl} alt="Collection NFT." />
				{/if}
			{/each}
		{:else if !isLoading && collectionDetail && !collectionDetail.nfts?.length}
			No NFTs in collection
		{:else}
			<DiamondsLoader />
		{/if}
	</div>
</div>
