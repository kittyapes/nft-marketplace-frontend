<script lang="ts">
	import EthIcon from './EthIcon.svelte';
	import type { NftActivityHistoryTableRowData } from './types';

	export let data: NftActivityHistoryTableRowData[] = [];
</script>

<div id="grid-container" class="grid h-full grid-cols-5 py-2 overflow-y-auto font-semibold bg-white border border-gray-300 rounded-xl blue-scrollbar" style:--list-length={data.length}>
	<div>Event</div>
	<div>Price</div>
	<div>From</div>
	<div>To</div>
	<div>Date</div>

	{#each data as row}
		<div>{row.event}</div>
		{#if row.price}
			<div class="gap-x-2"><EthIcon />{row.price}</div>
		{:else}
			<div />
		{/if}
		<div><a href="/profile/{row.from}" target="_blank" class="flex items-center h-full hover:text-blue-500">{row.from}</a></div>
		<div><a href="/profile/{row.to}" target="_blank" class="flex items-center h-full hover:text-blue-500">{row.to}</a></div>
		<div>{row.date}</div>
	{/each}

	{#if !data.length}
		<div class="self-stretch justify-center col-span-5 !bg-white opacity-50">No NFT activity history.</div>
	{/if}
</div>

<style>
	#grid-container {
		grid-template-rows: repeat(var(--list-length), min-content);
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
