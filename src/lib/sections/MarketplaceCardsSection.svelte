<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import NftList from '$lib/components/NftList.svelte';
	import { listingToCardOptions } from '$utils/adapters/cardOptions';
	import type { ListingFetchOptions } from '$utils/api/listing';
	import { getListings, type ListingType } from '$utils/api/listing';
	import { notifyError } from '$utils/toast';
	import { debounce } from 'lodash-es';

	let data = [];

	let reachedEnd = false;
	let isLoading = true;
	let index = 1;

	let fetchOptions: ListingFetchOptions = {};
	let lastFetchOptions = '';

	let fetchFunction = async () => {
		const res = {} as FetchFunctionResult;
		res.res = await getListings({ ...fetchOptions, listingStatus: ['UNLISTED', 'ACTIVE'] }, index, 20);
		res.adapted = await Promise.all(res.res.map(listingToCardOptions));

		return res;
	};

	async function fetchMore() {
		if (reachedEnd || !browser) return;
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
		}
	}, 1000);

	export function refreshWithFilters() {
		const params = $page.url.searchParams;

		fetchOptions.type = params.get('types')?.split('+') as ListingType[];
		fetchOptions.sortBy = params.get('sortBy') as any;
		fetchOptions.collectionId = params.get('collections');
		fetchOptions.priceMin = params.get('minPrice');
		fetchOptions.priceMax = params.get('maxPrice');

		debouncedFetchMore();
	}

	refreshWithFilters();
</script>

<div class="flex flex-wrap justify-center gap-6 cards">
	<NftList options={data} {isLoading} {reachedEnd} on:end-reached={fetchMore} />
</div>
