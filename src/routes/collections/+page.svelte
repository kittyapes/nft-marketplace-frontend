<script lang="ts">
	import HomepageCollections from '$lib/components/collections/HomepageCollections.svelte';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';

	let collections: (Collection & { ranking?: number })[] = [];

	let isLoading = true;
	let startAtPage = 1;
	const limit = 10;

	let totalNumberOfItems = 0;

	const fetchFunction = async (page: number) => {
		isLoading = true;

		const res = await apiSearchCollections({ limit, page });

		if (res.err) {
			console.error(res.err);
			notifyError('Failed to fetch collections.');
			return;
		}

		collections = res.collections;
		collections.forEach((c, i) => (c.ranking = i + 1 + (page - 1) * limit));
		totalNumberOfItems = res.totalCount;

		isLoading = false;
	};

	onMount(() => fetchFunction(startAtPage));
</script>

<HomepageCollections
	on:selected={(event) => fetchFunction(event.detail.page)}
	{collections}
	{isLoading}
	{totalNumberOfItems}
	itemsPerPage={limit}
/>
