<script lang="ts">
	import RefreshStretchedIcon from '$icons/refresh-stretched-icon.svelte';
	import Search from '$icons/search.svelte';
	import CollectionsTable from '$lib/components/v2/Marketplace/Collections/CollectionsTable/+page.svelte';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';
	import Input from '../../Input/Input.svelte';
	import SortButton from '$components/v2/SortButton/+page.svelte';
	import { globalCollectionsSearch } from '$utils/api/search/globalSearch';
	import { debounce } from 'lodash-es';

	let collections: Collection[] = [];
	let query: string;
	let reachedEnd = false;
	let isLoading = true;
	let page = 1;

	const limit = 10;

	const fetchFunction = async () => {
		const res = await apiSearchCollections({ limit, page });
		return res.collections;
	};

	async function fetchMore() {
		if (reachedEnd || query) return;
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
			page++;
			collections = [...collections, ...res];
		}
		isLoading = false;
	}

	onMount(async () => {
		await fetchMore();
	});

	// TODO implement sort options
	let sortOptions: { title: string; action?: any }[] = [
		{
			title: 'Ending soon',
			action: () => {},
		},
		{
			title: 'Price low to high',
			action: () => {},
		},
		{
			title: 'Price high to low',
			action: () => {},
		},
		{
			title: 'Most favorited',
			action: () => {},
		},
	];

	const search = async () => {
		collections = [];
		isLoading = true;
		collections = (await globalCollectionsSearch(query, 10)).collections;
		isLoading = false;
	};
	const handleRefresh = async () => {
		if (query) {
			await search();
		} else {
			collections = [];
			await fetchMore();
		}
	};
	const debounceSearch = debounce(async () => {
		await search();
	}, 500);
	$: if (query) {
		debounceSearch();
	}
	$: if (!query) {
		collections = [];
		debounceSearch.cancel();
		fetchMore();
	}
</script>

<div>
	<div class="w-full flex flex-row items-center justify-end gap-x-4 my-6 2xl:my-8">
		<SortButton bind:sortOptions class="h-11 2xl:h-14 max-w-[123px]" />
	</div>
	<CollectionsTable bind:collections bind:isLoading on:end-reached={fetchMore} />
</div>
