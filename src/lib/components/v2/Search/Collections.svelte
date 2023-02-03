<script lang="ts">
	import CollectionsTable from '$components/v2/CollectionsTable/+page.svelte';
	import { notifyError } from '$utils/toast';
	import { globalCollectionsSearch } from '$utils/api/search/globalSearch';
	import type { Collection } from '$utils/api/collection';
	import { searchQuery } from '$stores/search';

	let collections: Collection[] = [];
	$: query = $searchQuery;
	let reachedEnd = false;
	let isLoading = true;
	let pageNumber = 1;
	const limit = 10;

	$: if (query) {
		reachedEnd = false;
		isLoading = true;
		pageNumber = 1;
		collections = [];

		fetchMore();
	}

	const fetchFunction = async () => {
		const res = await globalCollectionsSearch(query, limit, pageNumber);

		return res.collections;
	};

	async function fetchMore() {
		isLoading = true;

		const res = await fetchFunction();

		if (res.err) {
			console.error(res.err);
			notifyError('Failed to fetch more collections.');
			return;
		}

		if (res.length === 0) {
			reachedEnd = true;
		} else {
			pageNumber++;
			collections = [...collections, ...res];
		}
		isLoading = false;
	}
</script>

<div class="my-6 2xl:my-8 w-full"><CollectionsTable bind:collections bind:isLoading {reachedEnd} on:end-reached={fetchMore} /></div>
