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

	function clearData() {
		nftActivityHistoryData = [];
	}

	let isLoading = true;

	const pageLimit = 10;
	let page = 1;
	let historyEndReached = false;

	async function refreshTable() {
		isLoading = true;

		const historyRes = await apiGetNftActivityHistory(options.nfts[0].fullId, {
			sales: filterOptions[0].checked,
			transfers: filterOptions[1].checked,
			listings: filterOptions[2].checked,
			bids: filterOptions[3].checked,
			limit: pageLimit,
			page,
		});

		const beforeLen = nftActivityHistoryData.length;

		nftActivityHistoryData.push(...historyRes.map(toNftActivityHistoryTableRowData));
		nftActivityHistoryData = nftActivityHistoryData;

		const afterLen = nftActivityHistoryData.length;

		if (afterLen === beforeLen || historyRes.length < pageLimit) {
			historyEndReached = true;
		}

		isLoading = false;
	}

	async function loadNextPage() {
		page++;
		refreshTable();
	}

	function handleEndReached() {
		if (isLoading || historyEndReached) {
			return;
		}

		loadNextPage();
	}

	function handleFilterUpdate() {
		clearData();
		refreshTable();
	}

	onMount(refreshTable);
</script>

<!-- Entire section -->
<div class="flex-grow h-full pr-4 overflow-y-auto blue-scrollbar">
	<!-- Filter control -->
	<div class="flex mt-2 space-x-2">
		<div class="flex flex-grow space-x-2 overflow-x-scroll scrollbar-hidden">
			{#each filterOptions as opt}
				{#if opt.checked}
					<FilterChip text={opt.label} on:cross-click={() => (opt.checked = false)} />
				{/if}
			{/each}
		</div>

		<!-- Clear All button -->
		<button
			class="px-4 py-2 font-semibold rounded-md btn hover:bg-gray-100 disabled:hover:bg-transparent outline-none focus-visible:bg-gray-100"
			disabled={disableClearAll}
			on:click={() => checkFilterDropdown.clearAll()}
		>
			Clear All
		</button>

		<div class="w-40">
			<CheckFilterDropdown bind:options={filterOptions} bind:this={checkFilterDropdown} on:update={handleFilterUpdate} />
		</div>
	</div>

	<div class="h-[500px] mt-4">
		<NftActivityHistoryTable data={nftActivityHistoryData} skeleton={isLoading} on:end-reached={handleEndReached} displayEndReachedMsg={historyEndReached} />
	</div>
</div>
