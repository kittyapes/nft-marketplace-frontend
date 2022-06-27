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
		collections: {
			data: [],
			index: 1,
			reachedEnd: false
		},
		listings: {
			data: [],
			index: 1,
			reachedEnd: false
		},
		users: {
			data: [],
			index: 1,
			reachedEnd: false
		}
	};

	const searchListings = async (query: string) => {
		const res = await getListingsByTitle(query, fullResultsLimit, searchResults.listings.index).catch((e) => []);
		searchResults.listings.index++;
		let listings = res;
		searchResults.listings.data = await Promise.all(listings.map(adaptListingToNftCard));
		searchResults = searchResults;
	};

	const searchUsers = async (query: string) => {
		const res = await getUsersByName(query, fullResultsLimit, searchResults.users.index).catch((e) => []);
		searchResults.users.index++;
		searchResults.users.data = res;
		searchResults = searchResults;
	};

	const searchCollections = async (query: string) => {
		const res = await getCollectionsByTitle(query, fullResultsLimit, searchResults.collections.index).catch((e) => []);
		searchResults.collections.index++;
		searchResults.collections.data = res.filter((e) => e.slug);
		searchResults = searchResults;
	};

	const debouncedSearch = debounce(async (query: string) => {
		await searchGlobally(query);
	}, 500);

	const searchGlobally = async (query: string) => {
		await searchListings(query).catch((error) => console.log(error));
		await searchUsers(query).catch((error) => console.log(error));
		await searchCollections(query).catch((error) => console.log(error));
		loaded = false;
		console.log({ ...searchResults });
		loaded = true;
	};

	/*async function fetchMore() {
		if (reachedEnd) return;
		isLoading = true;

		console.log('PAGE: ', index);
		const res = await fetchFunction();

		if (res.err) {
			console.error(res.err);
			notifyError('Failed to fetch more listings.');
			return;
		}

		if (res.adapted.length === 0) {
			reachedEnd = true;
		} else {
			index++;
			data = [...data, ...res.adapted];
			console.log(data);
			console.log('UPADTING DATA');
		}
		isLoading = false;
	}*/

	onMount(() => debouncedSearch($searchQuery));
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
				<div class="flex flex-row overflow-x-auto gap-10 p-2 my-5 max-w-[91vw] scrollbar-hide">
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
					<NftList options={searchResults.listings.data} />
				</div>
			</div>
		{/if}
	{:else if loaded}
		<div class="p-40 text-xl text-center">No results found</div>
	{:else}
		<DiamondsLoader />
	{/if}
</div>
