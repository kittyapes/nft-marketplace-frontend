<script lang="ts">
	import { onMount } from 'svelte';
	// import { priceFilters, statusFilters } from '$stores/marketplace';
	import { getListings, Listing } from '$utils/api/listing';
	import { writable } from 'svelte/store';
	import NftCard from '$lib/components/NftCard.svelte';
	import { drop } from 'lodash-es';

	const listings = writable<Listing[]>([]);

	onMount(async () => {
		listings.set(await getListings());

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
			<!-- I guess a hotfix -->
			{#if listing?.drop}
				<NftCard imageUrl={listing.drop.imageUrl} name={listing.drop.title} price={listing.drop.price} />
			{/if}
		{/each}
	{:else}
		Loading...
	{/if}
</div>
