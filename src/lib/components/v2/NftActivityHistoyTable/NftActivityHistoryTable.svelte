<script lang="ts">
	import EthAddress from '$lib/components/EthAddress.svelte';
	import { toShortDisplayPrice } from '$utils/adapters/cardOptions';
	import { createEventDispatcher } from 'svelte';
	import { tick } from 'svelte';
	import EthIcon from './EthIcon.svelte';
	import type { NftActivityHistoryTableRowData } from './NftActivityHistoryTable';
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';

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

	const headers = ['Event', 'Price', 'From', 'To', 'Date'];
</script>

<div class="text-white border border-white h-full flex flex-col">
	<div class="grid grid-cols-5 px-4 border-b border-white py-4 gap-2">
		{#each headers as header}
			<div class="px-2">{header}</div>
		{/each}
	</div>

	<div data-simplebar data-simplebar-auto-hide="false" class="overflow-y-scroll scrollbar-hide">
		<div
			id="grid-container"
			class="grid h-full py-2 px-4 blue-scrollbar grid-cols-5 scrollbar-hide gap-2"
			style:--list-length={skeleton ? data.length + skeletonLength : data.length}
			on:scroll={handleScroll}
			bind:this={gridContainer}
		>
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
	</div>
</div>

<style type="postcss">
	#grid-container > :nth-child(5n + 1) {
		/* @apply px-6; */
	}

	#grid-container > div {
		@apply px-2 h-16 flex items-center truncate;
	}
</style>
