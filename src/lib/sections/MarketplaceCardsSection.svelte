<script lang="ts">
	import { getListings } from '$utils/api/listing';
	import type { listingFetchingFilters } from '$utils/api/listing';
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
			index++;
			data = [...data, ...res.adapted];
			console.log(data);
			console.log('UPADTING DATA');
		}
		isLoading = false;
	}

	const debouncedFetch = debounce(async () => {
		console.log('DEBOUNCED CALLING FETCH');
		reachedEnd = false;
		index = 1;
		data = [];
		await fetchMore();
	}, 200);

	filters.subscribe(async (state) => {
		console.log('UPADTING FILTERS');
		listingsFetchingFilters.collectionId = state.collection?.value;
		listingsFetchingFilters.type = await Array.from(state.status?.values());
		listingsFetchingFilters.price = state.price;
		listingsFetchingFilters.sortBy = state.sortBy;

		debouncedFetch.cancel();
		debouncedFetch();
	});
</script>

<div class="flex flex-wrap justify-center gap-6 mt-11 cards">
	<NftList options={data} {isLoading} {reachedEnd} on:end-reached={fetchMore} />
</div>
