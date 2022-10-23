<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SearchResults } from '$interfaces/search/searchResults';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import FeaturedArtistCard from '$lib/components/FeaturedArtistCard.svelte';
	import LargeCollectionCard from '$lib/components/LargeCollectionCard.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import { searchQuery } from '$stores/search';
	import { getCollectionsByTitle, getNftsByTitle, searchUsersByName } from '$utils/api/search/globalSearch';
	import { debounce } from 'lodash-es';
	import { inview } from 'svelte-inview';
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/marketplace/Sidebar.svelte';
	import { nftToCardOptions } from '$utils/adapters/cardOptions';
	import { onMount } from 'svelte';

	const fullResultsLimit = 20;

	let loaded = false;
	let sidebarOpen;
	const inviewOptions = {};

	let searchResults: SearchResults = {
		nfts: {
			data: [],
			index: 1,
			reachedEnd: false,
			isLoading: false,
			fetchFunction: async (query: string) => {
				if (searchResults.nfts.reachedEnd) return;

				searchResults.nfts.isLoading = true;

				const res = await getNftsByTitle(query, fullResultsLimit, searchResults.nfts.index).catch((e) => []);

				if (res.length === 0) {
					searchResults.nfts.reachedEnd = true;
					searchResults.nfts.isLoading = false;
					searchResults = searchResults;
					return;
				}

				searchResults.nfts.index++;
				let nfts = res;
				searchResults.nfts.data = [...searchResults.nfts.data, ...(await Promise.all(nfts.map(nftToCardOptions)))];
				searchResults.nfts.isLoading = false;

				searchResults = searchResults;
			},
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

				if (res.collections.length === 0) {
					searchResults.collections.reachedEnd = true;
					searchResults.collections.isLoading = false;
					searchResults = searchResults;
					return;
				}

				searchResults.collections.index++;
				searchResults.collections.data = [...searchResults.collections.data, ...res.collections.filter((e) => e?.slug)];
				searchResults.collections.isLoading = false;

				searchResults = searchResults;
			},
		},
		users: {
			data: [],
			index: 1,
			reachedEnd: false,
			isLoading: false,
			fetchFunction: async (query: string) => {
				if (searchResults.users.reachedEnd) return;

				searchResults.users.isLoading = true;

				const res = await searchUsersByName(query, fullResultsLimit, searchResults.users.index).catch((e) => []);

				if (res.length === 0) {
					searchResults.users.reachedEnd = true;
					searchResults.users.isLoading = false;
					searchResults = searchResults;
					return;
				}

				searchResults.users.index++;
				searchResults.users.data = [...searchResults.users.data, ...res];
				searchResults.users.isLoading = false;

				searchResults = searchResults;
			},
		},
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

	$: {
		if ($page.url.searchParams.has('query')) {
			$searchQuery = $page.url.searchParams.get('query');
		}
	}

	searchQuery.subscribe((query) => {
		debouncedSearch(query);
	});
</script>

<div class="w-full h-full p-10 flex flex-col gap-10 overflow-hidden">
	{#if loaded && (searchResults.collections.data.length > 0 || searchResults.nfts.data.length > 0 || searchResults.users.data.length > 0)}
		{#if searchResults.collections?.data.length}
			<div class="">
				<div class="font-semibold text-lg">
					<h1>Collection results</h1>
				</div>
				<div class="flex flex-row overflow-x-auto gap-10 p-2 my-5 max-w-[100vw] overflow-y-hidden blue-scrollbar">
					{#each searchResults.collections.data as collection}
						<LargeCollectionCard {collection} />
					{/each}
					{#if searchResults.collections.isLoading}
						<DiamondsLoader />
					{:else}
						<div use:inview={inviewOptions} on:change={() => searchResults.collections.fetchFunction($searchQuery)} />
					{/if}
				</div>
			</div>
		{/if}
		{#if searchResults.users?.data.length}
			<div class="">
				<div class="font-semibold text-lg">
					<h1>Verified Creators</h1>
				</div>
				<div class="flex flex-row overflow-x-auto gap-10 p-2 my-5 max-w-[100vw] overflow-y-hidden blue-scrollbar">
					{#each searchResults.users.data as user}
						<div class="" on:click={() => goto('/profile/' + user.address)}>
							<FeaturedArtistCard title={user.username || 'Guest User'} description={user.bio || 'No bio'} coverImg={user.coverUrl} profileImg={user.thumbnailUrl} />
						</div>
					{/each}
					{#if searchResults.users.isLoading}
						<DiamondsLoader />
					{:else}
						<div use:inview={inviewOptions} on:change={() => searchResults.users.fetchFunction($searchQuery)} />
					{/if}
				</div>
			</div>
		{/if}
		{#if searchResults.nfts?.data.length}
			<div class="w-full">
				<div class="font-semibold text-lg">
					<h1>Items</h1>
				</div>
				<div class="">
					<NftList
						options={searchResults.nfts.data}
						isLoading={searchResults.nfts.isLoading}
						on:end-reached={() => searchResults.nfts.fetchFunction($searchQuery)}
						reachedEnd={searchResults.nfts.reachedEnd}
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

<style type="postcss">
	.blue-scrollbar::-webkit-scrollbar {
		width: 0.5rem;
		height: 0.5rem;
	}

	.blue-scrollbar::-webkit-scrollbar-thumb {
		@apply bg-gradient-to-r from-color-purple to-color-blue rounded-full;
		box-shadow: inset 0 0 2px #c6c6c6;
	}
</style>
