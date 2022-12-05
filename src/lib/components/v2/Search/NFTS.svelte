<script lang="ts">
	import GridSelector from '$components/v2/GridSelector/+page.svelte';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import { globalNFTSearch } from '$utils/api/search/globalSearch';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { nftToCardOptions } from '$utils/adapters/cardOptions';
	import { notifyError } from '$utils/toast';
	import NftGrid from '$components/v2/NFTGrid/+page.svelte';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';

	let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';
	let limit = 10;
	let pageNumber = 1;
	let nfts = [];
	let isLoading = false;
	let reachedEnd = false;
	const fetchFunction = async () => {
		const res = {} as FetchFunctionResult;
		res.res = await globalNFTSearch($page?.url?.searchParams.get('query'), limit, pageNumber);
		console.log(res.res);
		res.adapted = await Promise.all(res.res.nfts?.map(nftToCardOptions)).catch((err) => {
			console.error(err);
			return [];
		});
		return res;
	};
	const fetchMore = async () => {
		if (reachedEnd || isLoading) return;
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
	const inviewOptions = {};
	onMount(async () => {
		await fetchMore();
	});
</script>

<div class="w-full pb-8">
	<div class="my-6 2xl:my-8 w-full flex items-center justify-end">
		<GridSelector bind:gridStyle />
	</div>
	<NftGrid bind:options={nfts} bind:gridStyle bind:reachedEnd bind:isLoading />
	{#if isLoading}
		<DiamondsLoader />
	{:else}
		<div use:inview={inviewOptions} on:change={onChange} />
	{/if}
</div>
