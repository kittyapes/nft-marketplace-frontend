<script lang="ts">
	import CollectionsTable from '$components/v2/CollectionsTable/+page.svelte';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { notifyError } from '$utils/toast';
	import CollectionTablePaginationFooter from '$lib/components/v2/CollectionsTable/CollectionTablePaginationFooter.svelte';
	import { onMount } from 'svelte';

	let collections: Collection[] = [];
	let isLoading = true;

	const limit = 15;
	const startAtPage = 1;

	let totalNumberOfCollections = 0;

	const fetchFunction = async (page: number) => {
		isLoading = true;

		const res = await apiSearchCollections({ limit, page });

		if (res.err) {
			console.error(res.err);
			notifyError('Failed to fetch collections.');
			return;
		}

		collections = res.collections;
		totalNumberOfCollections = res.totalCount;

		isLoading = false;
	};

	onMount(() => fetchFunction(startAtPage));

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
	<CollectionsTable bind:collections bind:isLoading />

	<CollectionTablePaginationFooter
		totalNumberOfItems={totalNumberOfCollections}
		itemsPerPage={limit}
		on:selected={(event) => fetchFunction(event.detail.page)}
	/>
</div>
