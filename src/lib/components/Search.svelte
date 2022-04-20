<script lang="ts">
	import Search from '$icons/search.svelte';
	import { debounce } from 'lodash-es';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { getCollectionsByTitle, getDropsByTitle, getUsersByName } from '$utils/api/search/globalSearch';
	import type { SearchResults } from 'src/interfaces/search/searchResults';

	let query;

	let searchResults: SearchResults = {
		collections: [],
		drops: [],
		users: []
	};

	const debouncedSearch = debounce(async () => {
		await searchGlobally();
	}, 500);

	let searchDrops = async (query: string) => {
		await getDropsByTitle(query)
			.then(async (response) => {
				searchResults.drops = response;
			})
			.catch((e) => notifyError(e.message));
	};

	let searchUsers = async (query: string) => {
		await getUsersByName(query)
			.then(async (response) => {
				searchResults.users = response;
			})
			.catch((e) => notifyError(e.message));
	};

	let searchCollections = async (query: string) => {
		await getCollectionsByTitle(query)
			.then(async (response) => {
				//searchResults.collections = response;
			})
			.catch((e) => notifyError(e.message));
	};

	$: if (query) {
		debouncedSearch();
	}

	const searchGlobally = async () => {
		await searchDrops(query)
			.then(() => {
				searchUsers(query)
					.then(() => {
						/*
						searchCollections(query)
							.then(() => {
								//display results
							})
							.catch((error) => console.log(error));
						*/
					})
					.catch((error) => console.log(error));
			})
			.catch((error) => console.log(error));

		console.log(searchResults);
	};
</script>

<div class="flex py-2 px-4 items-center gap-x-4 border border-black border-opacity-30 rounded-md flex-grow-[0.1]">
	<Search />

	<input bind:value={query} type="text" class="w-72 focus:outline-none" placeholder="Search nfts, collections, and artists" />
</div>
