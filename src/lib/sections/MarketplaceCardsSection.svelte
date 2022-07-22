<script lang="ts">
	import { page } from '$app/stores';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import NftList from '$lib/components/NftList.svelte';
	import { listingToCardOptions } from '$utils/adapters/listingToCardOptions';
	import type { ListingFetchOptions } from '$utils/api/listing';
	import { getListings, type ListingType } from '$utils/api/listing';
	import { notifyError } from '$utils/toast';
	import { debounce } from 'lodash-es';
	import { onMount } from 'svelte';

	let data = [];

	let reachedEnd = false;
	let isLoading = true;
	let index = 1;

	let fetchOptions: ListingFetchOptions = {};
	let lastFetchOptions = '';

	let fetchFunction = async () => {
		const res = {} as FetchFunctionResult;
		res.res = await getListings({ ...fetchOptions }, index, 20);
		console.log(res.res);
		res.adapted = res.res.map(listingToCardOptions);

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
		const params = $page.url.searchParams;

		fetchOptions.type = params.get('types')?.split('+') as ListingType[];
		fetchOptions.sortBy = params.get('sortBy') as any;
		fetchOptions.collectionId = params.get('collections');
		fetchOptions.priceMin = params.get('minPrice');
		fetchOptions.priceMax = params.get('maxPrice');

		debouncedFetchMore();
	}

	onMount(refreshWithFilters);
</script>

<div class="flex flex-wrap justify-center gap-6 mt-11 cards">
	<NftList options={data} {isLoading} {reachedEnd} on:end-reached={fetchMore} />
</div>
