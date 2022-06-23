<script lang="ts">
	import { onMount } from 'svelte';
	// import { priceFilters, statusFilters } from '$stores/marketplace';
	import { getListings } from '$utils/api/listing';
	import type { Listing, listingFetchingFilters } from '$utils/api/listing';
	import { writable } from 'svelte/store';
	import NftList from '$lib/components/NftList.svelte';
	import { adaptListingToNftCard } from '$utils/adapters/adaptListingToNftCard';
	import { filters } from '$stores/marketplace';

	const listings = writable<Listing[]>([]);
	let data;

	let listingsFetchingFilters: listingFetchingFilters = {};

	let getData = async (listingsFetchingFilters?: listingFetchingFilters) => {
		listings.set(await getListings(listingsFetchingFilters).catch((e) => []));
		data = await Promise.all($listings.map(adaptListingToNftCard));
	};

	filters.subscribe(async (state) => {
		//console.log(state);

		listingsFetchingFilters.collectionId = state.collection;
		listingsFetchingFilters.type = await Array.from(state.status?.values());
		listingsFetchingFilters.price = state.price;

		//console.log(listingsFetchingFilters);

		await getData(listingsFetchingFilters);
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

<div class="flex flex-wrap justify-center gap-6 mt-11 cards">
	{#await getData()}
		Loading...
	{:then _}
		<NftList options={data} />
	{/await}
</div>
