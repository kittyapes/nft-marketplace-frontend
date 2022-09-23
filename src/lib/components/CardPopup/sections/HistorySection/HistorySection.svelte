<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';

	import CheckFilterDropdown from '$lib/components/v2/CheckFilterDropdown/CheckFilterDropdown.svelte';
	import FilterChip from '$lib/components/v2/FilterChip/FilterChip.svelte';
	import NftActivityHistoryTable from '$lib/components/v2/NftActivityHistoyTable/NftActivityHistoryTable.svelte';
	import type { NftActivityHistoryTableRowData } from '$lib/components/v2/NftActivityHistoyTable/types';
	import { toNftActivityHistoryTableRowData } from '$utils/adapters';
	import { apiGetNftActivityHistory } from '$utils/api/nft';
	import { onMount } from 'svelte';

	export let options: CardOptions;

	let filterOptions = [
		{ label: 'Sales', checked: false },
		{ label: 'Transfers', checked: false },
		{ label: 'Listing', checked: false },
		{ label: 'Bids', checked: false },
	];

	$: disableClearAll = filterOptions.every((i) => !i.checked);

	let checkFilterDropdown: CheckFilterDropdown;

	let nftActivityHistoryData: NftActivityHistoryTableRowData[] = [];

	$: console.log(nftActivityHistoryData);

	onMount(async () => {
		// Fetch NFT activity history
		const historyRes = await apiGetNftActivityHistory(options.nfts[0].databaseId, {
			sales: filterOptions[0].checked,
			transfers: filterOptions[1].checked,
			listings: filterOptions[2].checked,
			bids: filterOptions[3].checked,
		});

		nftActivityHistoryData = historyRes.map(toNftActivityHistoryTableRowData);
	});
</script>

<!-- Entire section -->
<div class="flex-grow h-full pr-4 overflow-y-auto blue-scrollbar">
	<!-- Filter control -->
	<div class="flex mt-4 space-x-2">
		<div class="flex flex-grow space-x-2 overflow-x-scroll scrollbar-hidden">
			{#each filterOptions as opt}
				{#if opt.checked}
					<FilterChip text={opt.label} on:cross-click={() => (opt.checked = false)} />
				{/if}
			{/each}
		</div>

		<!-- Clear All button -->
		<button class="px-4 py-2 font-semibold rounded-md btn hover:bg-gray-100 disabled:hover:bg-transparent" disabled={disableClearAll} on:click={() => checkFilterDropdown.clearAll()}>Clear All</button>

		<div class="w-40">
			<CheckFilterDropdown bind:options={filterOptions} bind:this={checkFilterDropdown} />
		</div>
	</div>

	<div class="h-[500px] mt-4">
		<NftActivityHistoryTable data={nftActivityHistoryData} />
	</div>
</div>
