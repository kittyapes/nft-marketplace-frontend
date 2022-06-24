<script lang="ts">
	import { onMount } from 'svelte';
	// import { priceFilters, statusFilters } from '$stores/marketplace';
	import { getListings } from '$utils/api/listing';
	import type { Listing, listingFetchingFilters } from '$utils/api/listing';
	import { writable } from 'svelte/store';
	import NftList from '$lib/components/NftList.svelte';
	import { adaptListingToNftCard } from '$utils/adapters/adaptListingToNftCard';
	import { filters } from '$stores/marketplace';
	import { notifyError } from '$utils/toast';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import { debounce } from 'lodash-es';

	let data = [];

	let reachedEnd = false;
	let isLoading = true;
	let index = 1;

	let listingsFetchingFilters: listingFetchingFilters = {};

	onMount(fetchMore);

	/*filters.subscribe(async (state) => {
		listingsFetchingFilters.collectionId = state.collection;
		listingsFetchingFilters.type = await Array.from(state.status?.values());
		listingsFetchingFilters.price = state.price;

		debouncedFetch.cancel();
		debouncedFetch();
	});*/

	const debouncedFetch = debounce(async () => {
		reachedEnd = false;
		index = 1;
		data = [];
		await fetchMore();
	}, 500);

	let fetchFunction = async () => {
		const res = {} as FetchFunctionResult;
		res.res = await getListings(listingsFetchingFilters, index, 20);

		res.adapted = await Promise.all(res.res.map(adaptListingToNftCard));
		return res;
	};

	async function fetchMore() {
		if (reachedEnd) return;
		isLoading = true;
		console.log('PAGE: ', index);

		const res = await fetchFunction();

		if (res.err) {
			console.error(res.err);
			notifyError('Failed to fetch more listings.');
			return;
		}

		if (res.adapted.length === 0) {
			reachedEnd = true;
		} else {
			data = [...data, ...res.adapted];
			console.log(data);
			index++;
		}

		isLoading = false;
	}
</script>

<div class="flex flex-wrap justify-center gap-6 mt-11 cards">
	<NftList options={data} {isLoading} {reachedEnd} on:end-reached={fetchMore} />
</div>
