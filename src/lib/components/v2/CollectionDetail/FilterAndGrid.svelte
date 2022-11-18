<script lang="ts">
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import ArrowDown from '$icons/arrow-down.svelte';
	import MasonryGridIcon from '$icons/masonry-grid-icon.svelte';
	import Search from '$icons/search.svelte';
	import ThreeByThreeGridIcon from '$icons/three-by-three-grid-icon.svelte';
	import TwoByTwoGridIcon from '$icons/two-by-two-grid-icon.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import { slide } from 'svelte/transition';
	import Input from '../Input/Input.svelte';

	export let searchPhrase: string;
	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';
	let showSort = false;
	export let nfts: CardOptions[];
	let sortOptions: { title: string; action?: any }[] = [
		{
			title: 'Ending soon',
			action: () => {
				nfts = nfts?.sort((a, b) => {
					return a?.listingData?.endTime - b?.listingData?.endTime;
				});
			},
		},
		{
			title: 'Price low to high',
			action: () => {
				nfts = nfts?.sort((a, b) => {
					return parseFloat(a?.saleData?.price) - parseFloat(b?.saleData?.price);
				});
			},
		},
		{
			title: 'Price high to low',
			action: () => {
				nfts = nfts?.sort((a, b) => {
					return parseFloat(b?.saleData?.price) - parseFloat(a?.saleData?.price);
				});
			},
		},
		{
			title: 'Most favorited',
			action: () => {
				nfts = nfts?.sort((a, b) => {
					return b?.nfts?.[0]?.likes - a?.nfts?.[0]?.likes;
				});
			},
		},
	];
</script>

<div class="flex flex-row items-center gap-x-5 mt-8">
	<Input bind:value={searchPhrase} class="rounded-none border-2 border-gradient h-11 2xl:h-14 hover:text-white" placeholder="Search by name or attribute" height="44px">
		<Search class="ml-6 w-5 h-6" />
	</Input>
	<div class="h-11 2xl:h-14 min-w-[123px] flex-grow relative">
		<button on:click={() => (showSort = true)} class="w-full h-full border-gradient flex flex-row items-center justify-between px-3.5  hover:bg-main-gradient">
			<h2 class="text-base leading-7 capitalize text-opacity-70 whitespace-nowrap">Sort By</h2>
			<ArrowDown class="w-3.5 h-2.5 transform duration-500 {showSort ? '-rotate-180' : 'rotate-0'}" />
		</button>
		{#if showSort}
			<div
				transition:slide={{ duration: 300 }}
				use:outsideClickCallback={{
					cb: () => (showSort = false),
				}}
				class="relative z-10 mt-1 bg-dark-gradient w-full flex flex-col font-medium text-xs 2xl:text-sm leading-4 2xl:leading-5 whitespace-nowrap truncate sort-list"
			>
				{#each sortOptions as sortOption}
					<button on:click={sortOption.action} class="inline-flex w-full p-2.5 border-2 border-b-0 sort-border border-solid hover:bg-main-gradient">
						{sortOption.title}
					</button>
				{/each}
			</div>
		{/if}
	</div>

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

<style lang="postcss">
	.sort-list button:last-child {
		@apply border-b-2;
	}
	.sort-border {
		border-image: linear-gradient(45deg, rgba(134, 139, 247, 0.25), rgba(108, 199, 248, 0.25)) 1;
	}
</style>
