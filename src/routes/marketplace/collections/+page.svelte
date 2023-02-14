<script lang="ts">
	import CollectionsTable from '$components/v2/CollectionsTable/+page.svelte';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';
	import SortButton from '$components/v2/SortButton/+page.svelte';

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

		if (res.length < limit) {
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
</script>

<!-- <div class="w-full flex flex-row items-center justify-end gap-x-4 my-6 2xl:my-8">
		<SortButton bind:sortOptions class="h-11 2xl:h-14 max-w-[123px]" />
	</div> -->

<div class="mt-16">
	<CollectionsTable bind:collections bind:isLoading on:end-reached={fetchMore} />
</div>
