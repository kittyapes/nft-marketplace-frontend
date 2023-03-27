<script lang="ts">
	import SortButton, { type SortOption } from '$components/v2/SortButton/+page.svelte';
	import FiltersV2 from '$icons/filters-v2.svelte';
	import GridSelector from '$components/v2/GridSelector/+page.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import { listingToCardOptions } from '$utils/adapters/cardOptions';
	import type { ListingFetchOptions } from '$utils/api/listing';
	import { getListings, type ListingType } from '$utils/api/listing';
	import { notifyError } from '$utils/toast';
	import { debounce, sortBy } from 'lodash-es';
	import NftGrid from '$components/v2/NFTGrid/+page.svelte';
	import { inview } from 'svelte-inview';
	import StatusFilter from '$components/v2/NFTFilters/StatusFilter.svelte';
	import PriceFilter from '$components/v2/NFTFilters/PriceFilter.svelte';
	import CollectionsFilter from '$components/v2/NFTFilters/CollectionsFilter.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import { slide } from 'svelte/transition';
	import ChevronLeft from '$icons/chevron-left.svelte';
	import { cubicInOut } from 'svelte/easing';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';

	let showFilters = false;
	let sortOptions: SortOption[] = [
		{
			title: 'Recently created',
			id: 'RECENTLY_CREATED',
			disabled: true,
		},
		{
			title: 'Recently listed',
			id: 'RECENTLY_LISTED',
		},
		{
			title: 'Recently sold',
			id: 'RECENTLY_SOLD',
			disabled: true,
		},
		{
			title: 'Recently received',
			id: 'RECENTLY_RECEIVED',
			disabled: true,
		},
		{
			title: 'Ending soon',
			id: 'ENDING_SOON',
		},
		{
			title: 'Price low to high',
			id: 'PRICE_LOW_TO_HIGH',
		},
		{
			title: 'Price high to low',
			id: 'PRICE_HIGH_TO_LOW',
		},
		{
			title: 'Highest last sale',
			id: 'HIGHEST_LAST_SALE',
			disabled: true,
		},
		{
			title: 'Most viewed',
			id: 'MOST_VIEWED',
		},
		{
			title: 'Most favorited',
			id: 'MOST_FAVORITED',
		},
	];

	let data = [];
	let selectedSortOption: SortOption =
		sortOptions.find((v) => v.id === $page.url.searchParams.get('sortBy')) || sortOptions[1];

	let reachedEnd = false;
	let isLoading = true;
	let index = 1;
	let fetchOptions: ListingFetchOptions = {};
	let lastFetchOptions = '';

	const fetchFunction = async () => {
		const res = {} as FetchFunctionResult;
		res.res = await getListings(
			{ ...fetchOptions, listingStatus: ['UNLISTED', 'ACTIVE'] },
			index,
			20,
		);
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

	function refreshWithFilters() {
		const params = $page.url.searchParams;
		fetchOptions.type = params.get('types')?.split('+') as ListingType[];
		fetchOptions.sortBy = params.get('sortBy') as any;
		fetchOptions.collectionAddress = params.get('collections');
		fetchOptions.priceMin = params.get('minPrice');
		fetchOptions.priceMax = params.get('maxPrice');

		debouncedFetchMore();
	}

	function handleSortRequestRefresh() {
		if (selectedSortOption) {
			$page.url.searchParams.set('sortBy', selectedSortOption.id);
		} else {
			$page.url.searchParams.delete('sortBy');
		}

		goto('?' + $page.url.searchParams);

		refreshWithFilters();
	}

	onMount(() => {
		refreshWithFilters();
	});

	onDestroy(() => {
		$page.url.searchParams.delete('types');
		$page.url.searchParams.delete('sortBy');
		$page.url.searchParams.delete('collections');
		$page.url.searchParams.delete('minPrice');
		$page.url.searchParams.delete('maxPrice');
	});
</script>

<div class="w-full flex flex-row items-center justify-between gap-x-4 my-6 2xl:my-8">
	<button
		on:click={() => (showFilters = !showFilters)}
		class="h-12 hover:bg-main-gradient rounded-none border-2 border-gradient flex items-center justify-center gap-x-3 w-60"
	>
		{#if showFilters}
			<ChevronLeft class="w-4 h-4" />
		{:else}
			<FiltersV2 />
		{/if}

		Filter
	</button>

	<div class="flex flex-row items-center gap-x-4">
		<SortButton
			bind:sortOptions
			bind:selectedOption={selectedSortOption}
			on:request-refresh={handleSortRequestRefresh}
			class="h-12 w-48"
		/>
		<GridSelector bind:gridStyle />
	</div>
</div>

<div class="flex flex-row items-start gap-x-8">
	{#if showFilters}
		<div transition:slide|local={{ easing: cubicInOut, duration: 300 }} class="w-80 flex-shrink-0">
			<Accordion accordionLabel="Display only">
				<StatusFilter on:request-refresh={refreshWithFilters} />
			</Accordion>

			<Accordion accordionLabel="Price">
				<PriceFilter on:request-refresh={refreshWithFilters} />
			</Accordion>

			<!-- <Accordion accordionLabel="Type">
				<TypeFilter />
			</Accordion> -->

			<Accordion accordionLabel="Collections">
				<CollectionsFilter on:request-refresh={refreshWithFilters} />
			</Accordion>
		</div>
	{/if}

	<div class="w-full">
		<NftGrid bind:options={data} bind:gridStyle bind:reachedEnd bind:isLoading />

		{#if !isLoading}
			<div use:inview on:enter={fetchMore} />
		{/if}
	</div>
</div>
