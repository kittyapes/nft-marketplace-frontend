<script lang="ts">
	import type { SearchResults } from '$interfaces/search/searchResults';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import FeaturedArtistCard from '$lib/components/FeaturedArtistCard.svelte';
	import LargeCollectionCard from '$lib/components/LargeCollectionCard.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import { searchQuery } from '$stores/search';
	import { adaptListingToNftCard } from '$utils/adapters/adaptListingToNftCard';
	import { getCollectionsByTitle, getListingsByTitle, getUsersByName } from '$utils/api/search/globalSearch';
	import { debounce } from 'lodash-es';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const fullResultsLimit = 20;

	let loaded = false;

	let searchResults: SearchResults = {
		listings: {
			data: [],
			index: 1,
			reachedEnd: false,
			isLoading: false,
			fetchFunction: async (query: string) => {
				if (searchResults.listings.reachedEnd) return;

				searchResults.listings.isLoading = true;

				const res = await getListingsByTitle(query, fullResultsLimit, searchResults.listings.index).catch((e) => []);

				if (res.length === 0) {
					searchResults.listings.reachedEnd = true;
					searchResults.listings.isLoading = false;
					searchResults = searchResults;
					return;
				}

				searchResults.listings.index++;
				let listings = res;
				searchResults.listings.data = [...searchResults.listings.data, ...(await Promise.all(listings.map(adaptListingToNftCard)))];
				searchResults.listings.isLoading = false;

				searchResults = searchResults;
			}
		},
		collections: {
			data: [],
			index: 1,
			reachedEnd: false,
			isLoading: false,
			fetchFunction: async (query: string) => {
				if (searchResults.collections.reachedEnd) return;

				searchResults.collections.isLoading = true;

				const res = await getCollectionsByTitle(query, fullResultsLimit, searchResults.collections.index).catch((e) => []);

				if (res.length === 0) {
					searchResults.collections.reachedEnd = true;
					searchResults.collections.isLoading = false;
					searchResults = searchResults;
					return;
				}

				searchResults.collections.index++;
				searchResults.collections.data = [...searchResults.collections.data, ...res.filter((e) => e.slug)];
				searchResults.collections.isLoading = false;

				searchResults = searchResults;
			}
		},
		users: {
			data: [],
			index: 1,
			reachedEnd: false,
			isLoading: false,
			fetchFunction: async (query: string) => {
				if (searchResults.users.reachedEnd) return;

				searchResults.users.isLoading = true;

				const res = await getUsersByName(query, fullResultsLimit, searchResults.users.index).catch((e) => []);

				if (res.length === 0) {
					searchResults.users.reachedEnd = true;
					searchResults = searchResults;
					return;
				}

				searchResults.users.index++;
				searchResults.users.data = [...searchResults.users.data, ...res];
				searchResults.users.isLoading = false;

				searchResults = searchResults;
			}
		}
	};

	const debouncedSearch = debounce(async (query: string) => {
		loaded = false;
		await searchGlobally(query);
	}, 500);

	const searchGlobally = async (query: string) => {
		for (const [key, value] of Object.entries(searchResults)) {
			await value.fetchFunction(query).catch((error) => console.log(error));
		}
		loaded = true;
	};

	searchQuery.subscribe(async (val) => {
		loaded = false;
		for (const [key, value] of Object.entries(searchResults)) {
			value.data = [];
			value.index = 1;
			value.reachedEnd = false;
		}

		await debouncedSearch(val);
	});

	onMount(async () => await debouncedSearch($searchQuery));
</script>

<div class="w-full h-full p-10 flex flex-col gap-10 overflow-hidden">
	{#if loaded && (searchResults.collections.data.length > 0 || searchResults.listings.data.length > 0 || searchResults.users.data.length > 0)}
		{#if searchResults.collections?.data.length}
			<div class="">
				<div class="font-semibold text-lg">
					<h1>{searchResults.collections.data.length} Collection results</h1>
				</div>
				<div class="flex flex-row overflow-x-auto gap-10 p-2 my-5 max-w-[91vw] scrollbar-hide">
					{#each searchResults.collections.data as collection}
						<LargeCollectionCard {collection} />
					{/each}
				</div>
			</div>
		{/if}
		{#if searchResults.users?.data.length}
			<div class="">
				<div class="font-semibold text-lg">
					<h1>{searchResults.users.data.length} Verified Creators</h1>
				</div>
				<div class="flex flex-row overflow-x-auto gap-10 p-2 my-5 max-w-[95vw] scrollbar-hide">
					{#each searchResults.users.data as user}
						<div class="max-w-xs w-full" on:click={() => goto('/profile/' + user.address)}>
							<FeaturedArtistCard title={user.username} description={user.bio} coverImg={user.coverUrl} profileImg={user.thumbnailUrl} />
						</div>
					{/each}
				</div>
			</div>
		{/if}
		{#if searchResults.listings?.data.length}
			<div class="w-full">
				<div class="font-semibold text-lg">
					<h1>{searchResults.listings.data.length} items</h1>
				</div>
				<div class="">
					<NftList
						options={searchResults.listings.data}
						isLoading={searchResults.listings.isLoading}
						on:end-reached={() => searchResults.listings.fetchFunction($searchQuery)}
						reachedEnd={searchResults.listings.reachedEnd}
					/>
				</div>
			</div>
		{/if}
	{:else if loaded}
		<div class="p-40 text-xl text-center">No results found</div>
	{:else}
		<DiamondsLoader />
	{/if}
</div>
