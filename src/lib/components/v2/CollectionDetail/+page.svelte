<script lang="ts">
	import type { Collection } from '$utils/api/collection';
	import Button from '$lib/components/Button.svelte';
	import FiltersV2 from '$icons/filters-v2.svelte';
	import Input from '../Input/Input.svelte';
	import ArrowDown from '$icons/arrow-down.svelte';
	import Search from '$icons/search.svelte';
	import TwoByTwoGridIcon from '$icons/two-by-two-grid-icon.svelte';
	import ThreeByThreeGridIcon from '$icons/three-by-three-grid-icon.svelte';
	import MasonryGridIcon from '$icons/masonry-grid-icon.svelte';
	import RefreshStretchedIcon from '$icons/refresh-stretched-icon.svelte';
	import ChevronLeft from '$icons/chevron-left.svelte';
	import NftGrid from './NFTGrid.svelte';
	import CollectionValues from './CollectionValues.svelte';
	import CollectionIdentity from './CollectionIdentity.svelte';
	import CollectionDescription from './CollectionDescription.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import StatusFilter from '../CollectionFilters/StatusFilter.svelte';
	import PriceFilter from '../CollectionFilters/PriceFilter.svelte';
	import TypeFilter from '../CollectionFilters/TypeFilter.svelte';
	import CollectionsFilter from '../CollectionFilters/CollectionsFilter.svelte';
	let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';

	export let collectionData: Collection;
	export let nfts = [];
	let filtersShown = true;
	let statusFilter: string;
	let minPrice: number;
	let maxPrice: number;
	let typeFilter: string;
</script>

<main class="px-36 pt-24 mx-auto text-white">
	<div class="w-full h-[426px] overflow-hidden">
		{#if collectionData?.backgroundImageUrl}
			<img class="object-cover object-center w-full" src={collectionData?.backgroundImageUrl} alt="" />
		{:else}
			<div class="w-full h-full bg-gray-100" />
		{/if}
	</div>
	<div class="w-full flex items-center justify-between mt-10 2xl:mt-12">
		<CollectionIdentity bind:collectionData />
		<CollectionValues bind:collectionData />
	</div>
	<!-- Description -->
	<CollectionDescription bind:collectionData actionLabel="Follow" />
	<!-- Filter and grid selection-->
	<div class="flex flex-row items-center gap-x-5 mt-8">
		<Button
			on:click={() => {
				filtersShown = !filtersShown;
			}}
			dullgradient
			variant="square"
			class="w-24 h-11 2xl:h-14 2xl:w-[123px] border-gradient flex flex-row items-center gap-x-3 hover:bg-main-gradient"
		>
			{#if filtersShown}
				<ChevronLeft class="w-1.5 h-2.5" />
			{:else}
				<FiltersV2 class="w-3.5 h-2.5" />
			{/if}
			<h2 class="text-base leading-7 capitalize">Filter</h2>
		</Button>
		<button class="min-w-[44px] h-11 2xl:h-14 2xl:min-w-[55px] border-gradient dull-gradient flex flex-row items-center justify-center transition-btn  hover:bg-main-gradient">
			<RefreshStretchedIcon class="w-5 h-5" />
		</button>
		<Input class="rounded-none border-4 border-gradient h-11 2xl:h-14 hover:text-white" placeholder="Search by name or attribute" height="44px">
			<Search class="ml-6 w-5 h-6" />
		</Input>
		<Button dullgradient variant="square" class="w-24 h-11 2xl:h-14 2xl:w-[123px] border-gradient flex flex-row items-center justify-between px-3.5  hover:bg-main-gradient">
			<h2 class="text-base leading-7 capitalize text-opacity-70 whitespace-nowrap">Sort By</h2>
			<ArrowDown class="w-3.5 h-2.5" />
		</Button>

		<div class="flex items-center">
			<button
				on:click={() => (gridStyle = 'normal')}
				class="w-11 h-11 2xl:h-14 2xl:w-14 border-gradient flex flex-row items-center justify-center transition-btn hover:bg-main-gradient {gridStyle === 'normal' ? 'transform scale-y-[1.08]' : ''}"
			>
				<TwoByTwoGridIcon class="w-5 h-5" />
			</button>
			<button
				on:click={() => (gridStyle = 'dense')}
				class="w-11 h-11 2xl:h-14 2xl:w-14 border-gradient border-x-0 flex flex-row items-center justify-center transition-btn hover:bg-main-gradient {gridStyle === 'dense'
					? 'transform scale-y-[1.08]'
					: ''}"
			>
				<ThreeByThreeGridIcon class="w-5 h-5" />
			</button>
			<button
				on:click={() => (gridStyle = 'masonry')}
				class="w-11 h-11 2xl:h-14 2xl:w-14 border-gradient flex flex-row items-center justify-center transition-btn hover:bg-main-gradient {gridStyle === 'masonry' ? 'transform scale-y-[1.08]' : ''}"
			>
				<MasonryGridIcon class="w-5 h-5" />
			</button>
		</div>
	</div>
	<!-- Filter panel and NFT grid -->
	<div class="w-full flex flex-row items-start gap-x-4 2xl:gap-x-5 mt-6 ">
		<div class:hidden={!filtersShown} class=" w-[261px] 2xl:w-[345px] flex flex-col ">
			<Accordion accordionLabel="Status">
				<StatusFilter bind:statusFilter />
			</Accordion>
			<Accordion accordionLabel="Price">
				<PriceFilter bind:minPrice bind:maxPrice />
			</Accordion>
			<Accordion accordionLabel="Type">
				<TypeFilter bind:typeFilter />
			</Accordion>
			<Accordion accordionLabel="Collections">
				<CollectionsFilter />
			</Accordion>
		</div>
		<NftGrid bind:options={nfts} bind:gridStyle bind:filtersShown />
	</div>
</main>
