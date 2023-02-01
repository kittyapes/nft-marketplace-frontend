<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';

	import CheckFilterDropdown from '$lib/components/v2/CheckFilterDropdown/CheckFilterDropdown.svelte';
	import FilterChip from '$lib/components/v2/FilterChip/FilterChip.svelte';
	import NftActivityHistoryTable from '$lib/components/v2/NftActivityHistoyTable/NftActivityHistoryTable.svelte';
	import type { NftActivityHistoryTableRowData } from '$lib/components/v2/NftActivityHistoyTable/NftActivityHistoryTable';
	import { toNftActivityHistoryTableRowData } from '$utils/adapters';
	import { apiGetNftActivityHistory } from '$utils/api/nft';
	import { onMount, tick } from 'svelte';

	export let options: CardOptions;

	let filterOptions = [
		{ label: 'Sales', checked: false },
		{ label: 'Transfers', checked: false },
		{ label: 'Listing', checked: false },
		{ label: 'Bids', checked: false },
	];

	$: checkedFilterOptions = filterOptions.filter((v) => v.checked);

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

	let filterChipsWrapper: HTMLElement;
	let filterChipsWidth;
	let filterChips: HTMLElement[] = [];

	async function updateFilterChipsOpacity() {
		if (!filterChipsWrapper) {
			return;
		}

		await tick();

		const chipsWrapperRect = filterChipsWrapper.getBoundingClientRect();

		for (const chip of filterChips) {
			if (!chip) {
				continue;
			}

			const chipRect = chip.getBoundingClientRect();

			if (chipRect.right > chipsWrapperRect.right) {
				chip.style.opacity = '0';
			} else {
				chip.style.opacity = '1';
			}
		}
	}

	$: checkedFilterOptions, updateFilterChipsOpacity();

	let filterChipsWrapperWidth;
	$: filterChipsWrapperWidth, updateFilterChipsOpacity();
</script>

<div class="pr-4 blue-scrollbar aspect-1 flex flex-col overflow-hidden">
	<!-- Filter control -->
	<div class="flex mt-2 gap-2">
		<div bind:this={filterChipsWrapper} bind:clientWidth={filterChipsWrapperWidth} class="flex-grow overflow-hidden">
			<div bind:clientWidth={filterChipsWidth} class="flex gap-2 h-full w-min">
				{#each checkedFilterOptions as opt, index}
					{#if opt.checked}
						<div bind:this={filterChips[index]} class="h-full">
							<FilterChip text={opt.label} on:cross-click={() => (opt.checked = false)} />
						</div>
					{/if}
				{/each}
			</div>
		</div>

		<div class="w-28 relative">
			<CheckFilterDropdown bind:options={filterOptions} bind:this={checkFilterDropdown} on:update={handleFilterUpdate} />

			{#if filterChipsWidth > filterChipsWrapper?.clientWidth}
				<div class="absolute -top-2 -right-2 bg-color-blue rounded-full text-black font-semibold w-5 aspect-1 grid place-items-center text-xs pl-[0.07rem]">
					{checkedFilterOptions.length}
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-4 flex-grow overflow-hidden">
		<NftActivityHistoryTable data={nftActivityHistoryData} skeleton={isLoading} on:end-reached={handleEndReached} displayEndReachedMsg={historyEndReached} />
	</div>
</div>
