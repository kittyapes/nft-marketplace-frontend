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
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import debounce from 'lodash-es/debounce';

	const inviewOptions = {};
	let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';

	let limit = 15;
	let pageNumber = 1;

	let nfts = [];
	let isLoading = false;
	let reachedEnd = false;
	let showLoader = true;

	let query = writable('');

	if ($page.url.searchParams.get('query')) {
		$searchQuery = $page.url.searchParams.get('query');
	}

	const fetchFunction = async () => {
		const res = {} as FetchFunctionResult;

		res.res = await globalNFTSearch($query, limit, pageNumber);
		res.adapted = await Promise.all(res.res.nfts?.map(nftToCardOptions)).catch((err) => {
			console.error(err);
			return [];
		});

		return res;
	};

	const fetchMore = async () => {
		if (isLoading || reachedEnd) return;
		isLoading = true;
		showLoader = true;

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
		showLoader = true;
	};

	const debouncedFetch = debounce(async () => {
		await fetchMore();
	}, 300);

	const unsubscribeQuery = searchQuery.subscribe((val) => ($query = val));

	query.subscribe((val) => {
		if (!browser) return;

		reachedEnd = false;
		isLoading = false;
		showLoader = true;
		pageNumber = 1;
		nfts = [];

		debouncedFetch();
		$page.url.searchParams.set('query', val);
		goto('?' + $page.url.searchParams, { replaceState: true, keepfocus: true, noscroll: true });
	});

	function onChange(event) {
		if (event.detail.inView) {
			fetchMore();
		}
	}

	onDestroy(unsubscribeQuery);
</script>

<div class="w-full pb-8">
	<div class="my-6 2xl:my-8 w-full flex items-center justify-end">
		<GridSelector bind:gridStyle />
	</div>

	<NftGrid options={nfts} bind:gridStyle bind:reachedEnd bind:isLoading />

	{#if showLoader && nfts.length > 0 && !reachedEnd}
		<div use:inview={inviewOptions} on:change={onChange} />
	{/if}
</div>
