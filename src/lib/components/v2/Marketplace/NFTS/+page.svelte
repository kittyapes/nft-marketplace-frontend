<script lang="ts">
	import RefreshStretchedIcon from '$icons/refresh-stretched-icon.svelte';
	import Search from '$icons/search.svelte';
	import Input from '../../Input/Input.svelte';
	import SortButton from '$components/v2/SortButton/+page.svelte';
	import FiltersV2 from '$icons/filters-v2.svelte';
	import Button from '$lib/components/Button.svelte';
	import ArrowLeft from '$icons/arrow-left.svelte';
	import GridSelector from '$components/v2/GridSelector/+page.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import { listingToCardOptions } from '$utils/adapters/cardOptions';
	import type { ListingFetchOptions } from '$utils/api/listing';
	import { getListings, type ListingType } from '$utils/api/listing';
	import { notifyError } from '$utils/toast';
	import { debounce } from 'lodash-es';
	import NftGrid from '$components/v2/NFTGrid/+page.svelte';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';
	import StatusFilter from '$components/v2/NFTFilters/StatusFilter.svelte';
	import PriceFilter from '$components/v2/NFTFilters/PriceFilter.svelte';
	import TypeFilter from '$components/v2/NFTFilters/TypeFilter.svelte';
	import CollectionsFilter from '$components/v2/NFTFilters/CollectionsFilter.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import { slide } from 'svelte/transition';
	import ChevronLeft from '$icons/chevron-left.svelte';
	import { cubicInOut } from 'svelte/easing';

	let searchPhrase: string;
	let showFilters = false;
	let sortOptions: { title: string; action?: any }[] = [
		{
			title: 'Ending soon',
			action: () => {},
		},
		{
			title: 'Price low to high',
			action: () => {},
		},
		{
			title: 'Price high to low',
			action: () => {},
		},
		{
			title: 'Most favorited',
			action: () => {},
		},
	];
	let data = [];
	let reachedEnd = false;
	let isLoading = true;
	let index = 1;
	let fetchOptions: ListingFetchOptions = {};
	let lastFetchOptions = '';
	let minPrice = 0;
	let maxPrice = 0;
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

	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';
	refreshWithFilters();
	function onChange(event) {
		if (event.detail.inView) {
			fetchMore();
		}
	}
	const inviewOptions = {};
</script>

<div>
	<div class="w-full flex flex-row items-center gap-x-4 my-6 2xl:my-8">
		<Button
			on:click={() => {
				showFilters = !showFilters;
			}}
			class="h-11 2xl:h-14 hover:bg-main-gradient rounded-none border-2 border-gradient flex items-center justify-between"
		>
			{#if showFilters}
				<ChevronLeft class=" w-4 h-4" />
			{:else}
				<FiltersV2 class=" w-5 h-6" />
			{/if}
			Filter
		</Button>
		<button class="w-11 h-11 2xl:h-14 2xl:w-14 min-w-[40px] 2xl:min-w-[50px] border-gradient flex-grow flex flex-row items-center justify-center transition-btn hover:bg-main-gradient">
			<RefreshStretchedIcon class="w-5 h-5" />
		</button>
		<Input bind:value={searchPhrase} class="rounded-none border-2 border-gradient h-11 2xl:h-14 hover:text-white" placeholder="Search by name or attribute" height="44px">
			<Search class="ml-6 w-5 h-6" />
		</Input>
		<SortButton bind:sortOptions class="h-11 2xl:h-14 min-w-[123px]" />
		<GridSelector bind:gridStyle />
	</div>
	<div class="w-full flex flex-row items-start gap-x-4 2xl:gap-x-5">
		{#if showFilters}
			<div transition:slide={{ easing: cubicInOut, duration: 300 }} class="w-[345px]">
				<Accordion accordionLabel="Status">
					<StatusFilter />
				</Accordion>
				<Accordion accordionLabel="Price">
					<PriceFilter bind:minPrice bind:maxPrice />
				</Accordion>
				<Accordion accordionLabel="Type">
					<TypeFilter />
				</Accordion>
				<Accordion accordionLabel="Collections">
					<CollectionsFilter />
				</Accordion>
			</div>
		{/if}
		<div class="w-full">
			<NftGrid bind:options={data} bind:gridStyle bind:reachedEnd bind:isLoading />
			{#if isLoading}
				<DiamondsLoader />
			{:else}
				<div use:inview={inviewOptions} on:change={onChange} />
			{/if}
		</div>
	</div>
</div>
