<script lang="ts">
	import EthIcon from './EthIcon.svelte';
	import type { NftActivityHistoryTableRowData } from './types';

	const skeletonLength = 5;

	export let data: NftActivityHistoryTableRowData[] = [];
	export let skeleton = false;
</script>

<div id="grid-container" class="grid h-full py-2 overflow-auto font-semibold bg-white border border-gray-300 rounded-xl blue-scrollbar" style:--list-length={skeleton ? skeletonLength : data.length}>
	<div>Event</div>
	<div>Price</div>
	<div>From</div>
	<div>To</div>
	<div>Date</div>

	{#if skeleton}
		{#each Array(skeletonLength * 5).fill(0) as i, index}
			<div>
				<div class="bg-gray-100 h-6 w-full rounded-md" />
			</div>
		{/each}
	{:else}
		{#each data as row}
			<div>{row.event}</div>
			{#if row.price}
				<div class="gap-x-2">
					<div class="w-4">
						<EthIcon />
					</div>
					{row.price}
				</div>
			{:else}
				<div />
			{/if}
			<div><a href="/profile/{row.from}" target="_blank" class="flex items-center h-full hover:text-blue-500">{row.from}</a></div>
			<div><a href="/profile/{row.to}" target="_blank" class="flex items-center h-full hover:text-blue-500">{row.to}</a></div>
			<div>{row.date}</div>
		{/each}
	{/if}

	{#if !data.length && !skeleton}
		<div class="self-stretch justify-center col-span-5 !bg-white opacity-50">No NFT activity history.</div>
	{/if}
</div>

<style>
	#grid-container {
		grid-template-rows: repeat(var(--list-length), min-content);
		grid-template-columns: minmax(10rem, auto) minmax(4rem, auto) minmax(10rem, auto) minmax(10rem, auto) minmax(10rem, auto);
	}

	#grid-container > :nth-child(-n + 5) {
		@apply border-b border-inherit;
	}

	#grid-container > div {
		@apply px-4 h-12 flex items-center truncate;
	}

	#grid-container > :nth-child(10n + 6),
	#grid-container > :nth-child(10n + 7),
	#grid-container > :nth-child(10n + 8),
	#grid-container > :nth-child(10n + 9),
	#grid-container > :nth-child(10n + 10) {
		@apply bg-gray-50;
	}
</style>
