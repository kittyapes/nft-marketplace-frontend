<script lang="ts">
	import { onMount } from 'svelte';
	// import { priceFilters, statusFilters } from '$stores/marketplace';
	import { getListings, Listing } from '$utils/api/listing';
	import { writable } from 'svelte/store';
	import NftList from '$lib/components/NftList.svelte';
	import { adaptListingToNftCard } from '$utils/adapters/adaptListingToNftCard';

	const listings = writable<Listing[]>([]);
	let data;

	let getData = async () => {
		listings.set(await getListings());
		data = await Promise.all($listings.map(adaptListingToNftCard));
		console.log(data);
	};

	/*onMount(async () => {
		await getData();
	});*/

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
		<NftList {data} />
	{/await}
</div>
