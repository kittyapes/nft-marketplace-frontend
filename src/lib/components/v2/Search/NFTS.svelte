<script lang="ts">
	import GridSelector from '$components/v2/GridSelector/+page.svelte';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import { globalNFTSearch } from '$utils/api/search/globalSearch';
	import { page } from '$app/stores';
	import { nftToCardOptions } from '$utils/adapters/cardOptions';
	import { notifyError } from '$utils/toast';
	import NftGrid from '$components/v2/NFTGrid/+page.svelte';
	import { inview } from 'svelte-inview';
	import { searchQuery } from '$stores/search';

	const inviewOptions = {};
	let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';

	let limit = 12;
	let pageNumber = 1;

	let nfts = [];
	let isLoading = true;
	let reachedEnd = false;

	$: query = $searchQuery;

	$: {
		if (gridStyle === 'normal') limit = 12;
		if (gridStyle === 'dense') limit = 15;
		if (gridStyle === 'masonry') limit = 15;
	}

	$: if (query) {
		reachedEnd = false;
		isLoading = true;
		pageNumber = 1;
		nfts = [];

		fetchMore();
	}

	const fetchFunction = async () => {
		const res = {} as FetchFunctionResult;

		res.res = await globalNFTSearch(query, limit, pageNumber);
		res.adapted = await Promise.all(res.res.nfts?.map(nftToCardOptions)).catch((err) => {
			console.error(err);
			return [];
		});

		return res;
	};

	const fetchMore = async () => {
		isLoading = true;

		const res = await fetchFunction();

		if (res.err) {
			console.error(res.err);
			notifyError('Failed to fetch more NFTs.');
			return;
		}

		if (res.adapted?.length === 0) {
			reachedEnd = true;
		} else {
			nfts = [...nfts, ...res.adapted];
			pageNumber++;
		}

		isLoading = false;
	};

	function onChange(event) {
		if (event.detail.inView) {
			fetchMore();
		}
	}
</script>

<div class="w-full pb-8">
	<div class="my-6 2xl:my-8 w-full flex items-center justify-end">
		<GridSelector bind:gridStyle />
	</div>

	<NftGrid options={nfts} bind:gridStyle bind:reachedEnd bind:isLoading />

	{#if !isLoading && nfts.length > 0 && !reachedEnd}
		<div use:inview={inviewOptions} on:change={onChange} />
	{/if}
</div>
