<script lang="ts">
	import Search from '$icons/search.svelte';
	import { debounce } from 'lodash-es';

	let query;
	let beginSearch = false;

	const debouncedSearch = debounce(async () => {
		beginSearch = true;
	}, 500);

	$: if (query) {
		debouncedSearch();
		console.log(beginSearch);
	}
</script>

<div class="flex py-2 px-4 items-center gap-x-4 border border-black border-opacity-30 rounded-md flex-grow">
	<Search />

	<input bind:value={query} type="text" class="w-72 focus:outline-none" placeholder="Search nfts, collections, and artists" />
</div>
