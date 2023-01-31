<script lang="ts">
	import CollectionsTable from '$components/v2/CollectionsTable/+page.svelte';
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { globalCollectionsSearch } from '$utils/api/search/globalSearch';
	import type { Collection } from '$utils/api/collection';

	let collections: Collection[] = [];
	let query: string;
	let reachedEnd = false;
	let isLoading = true;
	let pageNumber = 1;
	const limit = 10;

	const fetchFunction = async () => {
		const res = await globalCollectionsSearch($page?.url?.searchParams?.get('query'), limit, pageNumber);
		return res.collections;
	};

	async function fetchMore() {
		if (reachedEnd) return;
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

	onMount(async () => {
		await fetchMore();
	});
</script>

<div class="my-6 2xl:my-8 w-full"><CollectionsTable bind:collections bind:isLoading on:end-reached={fetchMore} /></div>
