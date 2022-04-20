<script lang="ts">
	import Search from '$icons/search.svelte';
	import { searchDropsByTitle } from '$utils/search/globalSearch';
	import { debounce } from 'lodash-es';
	import { notifyError, notifySuccess } from '$utils/toast';

	let query;
	let beginSearch = false;

	const debouncedSearch = debounce(async () => {
		beginSearch = true;
	}, 500);

	let searchDrops = async (query: string) => {
		await searchDropsByTitle(query)
			.then((response) => console.log(response))
			.catch((e) => notifyError(e.message));
	};

	$: if (query) {
		debouncedSearch();
	}

	$: if (beginSearch) {
		searchDrops(query);
	}
</script>

<div class="flex py-2 px-4 items-center gap-x-4 border border-black border-opacity-30 rounded-md flex-grow">
	<Search />

	<input bind:value={query} type="text" class="w-72 focus:outline-none" placeholder="Search nfts, collections, and artists" />
</div>
