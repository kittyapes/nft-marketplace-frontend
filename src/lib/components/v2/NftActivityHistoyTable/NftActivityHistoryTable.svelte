<script lang="ts">
	import EthAddress from '$lib/components/EthAddress.svelte';
	import { toShortDisplayPrice } from '$utils/adapters/cardOptions';
	import { createEventDispatcher } from 'svelte';
	import { tick } from 'svelte';
	import EthIcon from './EthIcon.svelte';
	import type { NftActivityHistoryTableRowData } from './types';

	const dispatch = createEventDispatcher();

	const skeletonLength = 5;

	export let data: NftActivityHistoryTableRowData[] = [];
	export let skeleton = false;
	export let displayEndReachedMsg = false;

	function handleScroll(ev) {
		if (ev.target.scrollTop + ev.target.clientHeight >= ev.target.scrollHeight) {
			dispatch('end-reached');
		}
	}

	let gridContainer: HTMLElement;

	async function dispatchReachedEndIfNotFull() {
		if (!gridContainer) {
			return;
		}

		await tick();

		if (gridContainer.scrollHeight === gridContainer.clientHeight) {
			dispatch('end-reached');
		}
	}

	$: data, dispatchReachedEndIfNotFull();
</script>

<div
	id="grid-container"
	class="grid h-full py-2 overflow-auto border border-white overscroll-contain text-white blue-scrollbar"
	style:--list-length={skeleton ? data.length + skeletonLength : data.length}
	on:scroll={handleScroll}
	bind:this={gridContainer}
>
	<div>Event</div>
	<div>Price</div>
	<div>From</div>
	<div>To</div>
	<div>Date</div>

	{#each data as row}
		<div>{row.event}</div>
		{#if row.price}
			<div class="gap-x-2">
				<div class="w-4">
					<EthIcon />
				</div>
				{toShortDisplayPrice(`${row.price}`)}
			</div>
		{:else}
			<div />
		{/if}
		<!--<div><a href="/profile/{row.from}" target="_blank" class="flex items-center h-full hover:text-blue-500 outline-none">{row.from}</a></div>
		<div><a href="/profile/{row.to}" target="_blank" class="flex items-center h-full hover:text-blue-500 outline-none">{row.to}</a></div>-->
		<div><a href="/profile/{row.from}" target="_blank"><EthAddress address={row.from} etherScanLink={false} copyIcon={false} concat class="!text-white hover:!text-blue-500" /></a></div>
		<div><a href="/profile/{row.to}" target="_blank"><EthAddress address={row.to} etherScanLink={false} copyIcon={false} concat class="!text-white hover:!text-blue-500" /></a></div>
		<div>{row.date}</div>
	{/each}

	{#if skeleton}
		{#each Array(skeletonLength * 5).fill(0) as i, index}
			<div>
				<div class="bg-gray-800 opacity-50 h-6 w-full" />
			</div>
		{/each}
	{/if}

	{#if displayEndReachedMsg}
		<!-- I don't know why * 3, but it works :) -->
		<div class="flex items-center justify-center font-semibold col-span-5 opacity-50" style="height: {skeletonLength * 3}rem !important;">You have reached the end of this NFT's history.</div>
	{/if}

	{#if !data.length && !skeleton}
		<div class="self-stretch justify-center col-span-5 opacity-50">No NFT activity history.</div>
	{/if}
</div>

<style type="postcss">
	#grid-container {
		grid-template-rows: repeat(var(--list-length), min-content);
		grid-template-columns: minmax(12rem, auto) minmax(12rem, auto) minmax(8rem, auto) minmax(8rem, auto) minmax(10rem, auto);
	}

	#grid-container > :nth-child(-n + 5) {
		@apply border-b border-inherit font-semibold;
	}

	#grid-container > :nth-child(5n + 1) {
		@apply px-14;
	}
	#grid-container > div {
		@apply px-4 h-16 flex items-center truncate;
	}
</style>
