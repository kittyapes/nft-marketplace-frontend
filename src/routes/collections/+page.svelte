<script lang="ts">
	import HomepageCollections from '$lib/components/collections/HomepageCollections.svelte';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';

	let collections: Collection[] = [];

	let reachedEnd = false;
	let isLoading = true;
	let loaded = false;
	let page = 1;
	const limit = 10;

	let fetchFunction = async () => {
		const res = await apiSearchCollections({ limit, page });
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
