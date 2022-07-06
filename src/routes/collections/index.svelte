<script lang="ts">
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import HomepageCollections from '$lib/components/collections/HomepageCollections.svelte';
	import { apiSearchCollections, type CollectionTableRow } from '$utils/api/collection';
	import { getListings } from '$utils/api/listing';
	import { notifyError } from '$utils/toast';
	import dayjs from 'dayjs';
	import { debounce } from 'lodash-es';
	import { onMount } from 'svelte';

	let collections: CollectionTableRow[] = [];

	let reachedEnd = false;
	let isLoading = true;
	let loaded = false;
	let page = 1;
	const limit = 10;

	let fetchFunction = async () => {
		const res = await apiSearchCollections({ limit, page });
		return res;
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
			page++;
			collections = [...collections, ...res];
		}
		isLoading = false;
	}

	onMount(async () => {
		await fetchMore();
		loaded = true;
	});
</script>

<HomepageCollections {collections} {loaded} {isLoading} {reachedEnd} on:end-reached={fetchMore} />
