<script lang="ts">
	import type { SearchResults } from '$interfaces/search/searchResults';
	import LargeCollectionCard from '$lib/components/LargeCollectionCard.svelte';

	import LoadedContent from '$lib/components/LoadedContent.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import { searchQuery } from '$stores/search';
	import { adaptListingToNftCard } from '$utils/adapters/adaptListingToNftCard';
	import { getCollectionsByTitle, getListingsByTitle, getUsersByName } from '$utils/api/search/globalSearch';
	import { tick } from 'svelte';

	const fullResultsLimit = 1000;

	let loaded = false;

	let searchResults: SearchResults = {
		collections: [],
		listings: [],
		users: []
	};

	const searchListings = async (query: string) => {
		getListingsByTitle(query, fullResultsLimit)
			.then(async (response) => {
				let listings = response;
				searchResults.listings = await Promise.all(listings.map(adaptListingToNftCard));
			})
			.catch((e) => []);
	};

	const searchUsers = async (query: string) => {
		getUsersByName(query, fullResultsLimit)
			.then(async (response) => {
				searchResults.users = response;
			})
			.catch((e) => []);
	};

	const searchCollections = async (query: string) => {
		getCollectionsByTitle(query, fullResultsLimit)
			.then(async (response) => {
				searchResults.collections = response.filter((e) => e.slug);
			})
			.catch((e) => []);
	};

	searchQuery.subscribe(async (query) => {
		loaded = false;
		await searchCollections(query).catch((error) => console.log(error));
		await searchListings(query).catch((error) => console.log(error));
		await searchUsers(query).catch((error) => console.log(error));

		console.log(searchResults);
		await tick();
		loaded = true;
	});
</script>

<LoadedContent {loaded}>
	<div class="w-full h-full p-10 flex flex-col gap-10 overflow-hidden">
		{#if searchResults.collections?.length}
			<div class="">
				<div class="font-semibold text-lg">
					<h1>{searchResults.collections.length} Collection results</h1>
				</div>
				<div class="flex flex-row overflow-x-auto gap-10 p-2 my-5 max-w-[91vw] scrollbar-hide">
					{#each searchResults.collections as collection}
						<LargeCollectionCard {collection} />
					{/each}
				</div>
			</div>
		{/if}
		{#if searchResults.listings?.length}
			<div class="w-full">
				<div class="font-semibold text-lg">
					<h1>{searchResults.listings.length} items</h1>
				</div>
				<div class="">
					<NftList options={searchResults.listings} />
				</div>
			</div>
		{/if}
	</div>
</LoadedContent>
