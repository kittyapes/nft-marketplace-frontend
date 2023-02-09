<script lang="ts">
	import CollectionsTable from '$components/v2/CollectionsTable/+page.svelte';
	import { notifyError } from '$utils/toast';
	import { globalCollectionsSearch } from '$utils/api/search/globalSearch';
	import type { Collection } from '$utils/api/collection';
	import { searchQuery } from '$stores/search';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import debounce from 'lodash-es/debounce';

	let collections: Collection[] = [];
	let query = writable('');
	let reachedEnd = false;
	let showLoader = true;
	let isLoading = false;
	let pageNumber = 1;
	const limit = 10;

	if ($page.url.searchParams.get('query')) {
		$searchQuery = $page.url.searchParams.get('query');
	}

	const fetchFunction = async () => {
		const res = await globalCollectionsSearch($query, limit, pageNumber);

		return res.collections;
	};

	async function fetchMore() {
		if (isLoading || reachedEnd) return;
		isLoading = true;
		showLoader = true;

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

		showLoader = false;
		isLoading = false;
	}

	const unsubscribeQuery = searchQuery.subscribe((val) => ($query = val));

	const debouncedFetch = debounce(async () => {
		await fetchMore();
	}, 300);

	query.subscribe((val) => {
		if (!browser) return;

		reachedEnd = false;
		isLoading = false;
		showLoader = true;
		pageNumber = 1;
		collections = [];

		debouncedFetch();
		$page.url.searchParams.set('query', val);
		goto('?' + $page.url.searchParams, { replaceState: true, keepfocus: true, noscroll: true });
	});

	onDestroy(unsubscribeQuery);
</script>

<div class="my-6 2xl:my-8 w-full"><CollectionsTable {collections} isLoading={showLoader} {reachedEnd} on:end-reached={fetchMore} /></div>
