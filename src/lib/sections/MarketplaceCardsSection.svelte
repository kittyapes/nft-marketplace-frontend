<script lang="ts">
	import { getListings, type ListingType } from '$utils/api/listing';
	import type { ListingFetchOptions } from '$utils/api/listing';
	import NftList from '$lib/components/NftList.svelte';
	import { adaptListingToNftCard } from '$utils/adapters/adaptListingToNftCard';
	import { notifyError } from '$utils/toast';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import { debounce } from 'lodash-es';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';

	let data = [];

	let reachedEnd = false;
	let isLoading = true;
	let index = 1;

	let fetchOptions: ListingFetchOptions = {};
	let lastFetchOptions = '';

	let fetchFunction = async () => {
		const res = {} as FetchFunctionResult;
		res.res = await getListings({ ...fetchOptions }, index, 20);
		res.adapted = await Promise.all(res.res.map(adaptListingToNftCard));

		// Hotfix to hide expired listings
		res.adapted = res.adapted.filter((l) => {
			try {
				const endingDate = dayjs(l.popupOptions.rawResourceData.startTime).add(l.popupOptions.rawResourceData.duration, 's');
				return endingDate.isAfter(dayjs());
			} catch {
				return true;
			}
		});

		return res;
	};

	async function fetchMore() {
		if (reachedEnd) return;
		isLoading = true;

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
		}
		isLoading = false;
	}

	const debouncedFetchMore = debounce(() => {
		if (JSON.stringify(fetchOptions) !== lastFetchOptions) {
			index = 1;
			reachedEnd = false;
			data = [];
			lastFetchOptions = JSON.stringify(fetchOptions);
			fetchMore();
		} else {
			console.log('skipping fetch');
		}
	}, 1000);

	export function refreshWithFilters() {
		console.log('filter update');

		const params = $page.url.searchParams;

		fetchOptions.type = params.get('types')?.split('+') as ListingType[];
		fetchOptions.sortBy = params.get('sortBy') as any;
		fetchOptions.collectionId = params.get('collections');
		fetchOptions.priceMin = params.get('minPrice');
		fetchOptions.priceMax = params.get('maxPrice');

		debouncedFetchMore();

		console.log({ fetchOptions });
	}

	onMount(refreshWithFilters);

	// filters.subscribe(async (state) => {
	// 	console.log('UPADTING FILTERS');
	// 	listingsFetchingFilters.collectionId = state.collection?.value;
	// 	listingsFetchingFilters.type = await Array.from(state.status?.values());
	// 	listingsFetchingFilters.price = state.price;
	// 	listingsFetchingFilters.sortBy = state.sortBy;

	// 	debouncedFetch.cancel();
	// 	debouncedFetch();
	// });
</script>

<div class="flex flex-wrap justify-center gap-6 mt-11 cards">
	<NftList options={data} {isLoading} {reachedEnd} on:end-reached={fetchMore} />
</div>
