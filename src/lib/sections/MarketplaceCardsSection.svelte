<script lang="ts">
	import Card from '$lib/components/marketplace/Card.svelte';
	import { onMount } from 'svelte';
	// import { priceFilters, statusFilters } from '$stores/marketplace';
	import { getListings, Listing } from '$utils/api/listing';
	import { writable } from 'svelte/store';
	import { getNft } from '$utils/api/nft';
	import NftCard from '$lib/components/NftCard.svelte';

	const listings = writable<Listing[]>([]);

	onMount(async () => {
		listings.set((await getListings()).reverse());

		console.log(listings);
	});

	// $: {
	// 	filteredCards = allCards;

	// 	// Status filter
	// 	if (allCards && $statusFilters.size > 0) {
	// 		filteredCards = filteredCards.filter((_card) => {
	// 			return $statusFilters.has(_card?.status);
	// 		});
	// 	}

	// 	// Price filter
	// 	if (allCards && $priceFilters.min < $priceFilters.max && $priceFilters.min != 0 && $priceFilters.max != 0) {
	// 		filteredCards = filteredCards.filter((_card) => {
	// 			return parseFloat(_card?.amount) >= $priceFilters.min && parseFloat(_card?.amount) <= $priceFilters.max;
	// 		});
	// 	}
	// }
</script>

<div class="flex flex-wrap mt-11 justify-center gap-6 cards">
	{#if $listings.length}
		{#each $listings as listing}
			{#await getNft(listing.drop.nft_ids[0])}
				<NftCard />
			{:then nft}
				<NftCard imageUrl={nft.imageUrl} name={nft.name} price={nft.price} />
			{/await}
		{/each}
	{:else}
		Loading...
	{/if}
</div>
