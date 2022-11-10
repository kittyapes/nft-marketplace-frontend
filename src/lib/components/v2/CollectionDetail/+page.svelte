<script lang="ts">
	import Copy from '$icons/copy.svelte';
	import Eth from '$icons/eth.svelte';
	import HinataBadge from '$icons/hinata-badge.svelte';
	import type { Collection } from '$utils/api/collection';
	import copyTextToClipboard from '$utils/copyTextToClipboard';
	import { shortenAddress } from '$utils/misc/shortenAddress';
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
	let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';

	export let collectionData: Collection;
	export let nfts = [];
	let filtersShown = false;
</script>

<main class="px-36 pt-24 mx-auto text-white">
	<div class="w-full h-[426px] overflow-hidden">
		{#if collectionData?.backgroundImageUrl}
			<img class="object-cover object-center w-full" src={collectionData?.backgroundImageUrl} alt="" />
		{:else}
			<div class="w-full h-full bg-gray-100" />
		{/if}
	</div>
	<div class="w-full flex items-center justify-between mt-12">
		<div class="flex flex-row gap-x-5 items-end">
			<div class="w-28 h-28 flex items-center justify-center overflow-hidden">
				<img src={collectionData?.logoImageUrl || '/svg/icons/guest-avatar.svg'} alt="Collection creator avatar." />
			</div>
			<div class="flex flex-col gap-y-6">
				<div class="flex flex-row items-center gap-x-2.5">
					<h1 class="font-semibold text-4xl leading-6 whitespace-nowrap">{collectionData?.name || ''}</h1>
					<HinataBadge class="h-8 w-8 {collectionData?.verified ? '' : 'hidden'}" />
					<!-- TODO add menu -->
				</div>
				<div class="flex flex-row items-center gap-x-2.5">
					<h3 class="text-gradient text-xl leading-6 whitespace-nowrap">{collectionData?.name || ''}</h3>
					<HinataBadge class="h-6 w-6 {collectionData?.verified ? '' : 'hidden'}" />
					<div class="flex flex-row items-center bg-black bg-opacity-25 px-2.5 py-1.5 gap-x-2.5">
						<Eth gradient class="w-3 h-5" />
						<p class="text-base">{shortenAddress(collectionData?.collectionAddress) || ''}</p>
						<button
							on:click={() => {
								copyTextToClipboard(collectionData?.collectionAddress);
							}}
						>
							<Copy class="w-3 h-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
		<!-- TODO fix sizing -->
		<!-- Table data -->
		<div class="flex flex-row items-center text-base leading-6">
			<div class="flex flex-col items-center justify-center border-gradient border-r-0 w-[132px] h-[106px]">
				<p>Highest Sale</p>
				<div class="flex items-center gap-x-1.5">
					<Eth class="w-2.5 h-4" />
					<span>{collectionData?.highestSale || 0.0}</span>
				</div>
			</div>
			<div class="flex flex-col items-center justify-center border-gradient border-r-0 w-[132px] h-[106px]">
				<p>Floor Price</p>
				<div class="flex items-center gap-x-1.5">
					<Eth class="w-2.5 h-4" />
					<span>{collectionData?.floorPrice || 0.0}</span>
				</div>
			</div>
			<div class="flex flex-col items-center justify-center border-gradient border-r-0 w-[132px] h-[106px]">
				<p>Total Volume</p>
				<div class="flex items-center gap-x-1.5">
					<Eth class="w-2.5 h-4" />
					<span>{collectionData?.totalVol || 0.0}</span>
				</div>
			</div>
			<div class="flex flex-col items-center justify-center border-gradient border-r-0 w-[132px] h-[106px]">
				<p>Items</p>
				<div class="flex items-center gap-x-1.5">
					<span>{collectionData?.items || 0.0}</span>
				</div>
			</div>
			<div class="flex flex-col items-center justify-center border-gradient border-r-0 w-[132px] h-[106px]">
				<p>Owners</p>
				<div class="flex items-center gap-x-1.5">
					<span>{collectionData?.owners || 0.0}</span>
				</div>
			</div>
			<div class="flex flex-col items-center justify-center border-gradient hover: w-[132px] h-[106px]">
				<p>24hr Volume</p>
				<div class="flex items-center gap-x-1.5">
					<Eth class="w-2.5 h-4" />
					<span>{collectionData?.total24hours || 0.0}</span>
				</div>
			</div>
		</div>
	</div>
	<!-- Description -->
	<div class="flex items-center justify-between mt-11">
		<p class="w-1/2 font-semibold text-sm leading-6">{collectionData?.description || ''}</p>
		<div class="w-1/2 flex items-center justify-end gap-x-4">
			<Button variant="square" dullgradient class="w-44 h-14 border-gradient hover:bg-gradient-a">Follow</Button>
			<!-- TODO this opens up all social links -->
			<button class="w-14 h-14 border-gradient dull-gradient flex items-center justify-center transition-btn">
				<!-- TODO add share icon -->
			</button>
		</div>
	</div>
	<!-- Filter and grid selection-->
	<div class="flex flex-row items-center gap-x-5 mt-8">
		<Button
			on:click={() => {
				filtersShown = !filtersShown;
			}}
			dullgradient
			variant="square"
			class="h-14 w-[123px] border-gradient flex flex-row items-center gap-x-3"
		>
			{#if filtersShown}
				<ChevronLeft class="w-1.5 h-2.5" />
			{:else}
				<FiltersV2 class="w-3.5 h-2.5" />
			{/if}
			<h2 class="text-base leading-7 capitalize">Filter</h2>
		</Button>
		<button class="h-14 w-14 border-gradient dull-gradient flex flex-row items-center justify-center transition-btn">
			<RefreshStretchedIcon class="w-5 h-5" />
		</button>
		<Input class="rounded-none border-4 border-gradient" height="56px" placeholder="Search by name or attribute">
			<Search class="ml-6 w-5 h-6" />
		</Input>
		<Button dullgradient variant="square" class="h-14  w-[123px] border-gradient flex flex-row items-center justify-between px-3.5">
			<h2 class="text-base leading-7 capitalize text-opacity-70 whitespace-nowrap">Sort By</h2>
			<ArrowDown class="w-3.5 h-2.5" />
		</Button>

		<div class="flex items-center">
			<button
				on:click={() => (gridStyle = 'normal')}
				class="h-14 w-14 border-gradient flex flex-row items-center justify-center transition-btn {gridStyle === 'normal' ? 'transform scale-y-[1.08]' : ''}"
			>
				<TwoByTwoGridIcon class="w-5 h-5" />
			</button>
			<button
				on:click={() => (gridStyle = 'dense')}
				class="h-14 w-14 border-gradient border-x-0 flex flex-row items-center justify-center transition-btn {gridStyle === 'dense' ? 'transform scale-y-[1.08]' : ''}"
			>
				<ThreeByThreeGridIcon class="w-5 h-5" />
			</button>
			<button
				on:click={() => (gridStyle = 'masonry')}
				class="h-14 w-14 border-gradient flex flex-row items-center justify-center transition-btn {gridStyle === 'masonry' ? 'transform scale-y-[1.08]' : ''}"
			>
				<MasonryGridIcon class="w-5 h-5" />
			</button>
		</div>
	</div>
	<!-- Filter panel and NFT grid -->
	<div class="w-full flex flex-row items-start gap-x-4 2xl:gap-x-5 mt-6 ">
		<div class:hidden={!filtersShown} class="w-[277px] 2xl:w-[345px] bg-red-400 h-96" />
		<NftGrid bind:options={nfts} bind:gridStyle bind:filtersShown />
	</div>
</main>
