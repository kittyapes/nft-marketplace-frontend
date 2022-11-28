<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Refresh from '$icons/refresh.svelte';
	import { getBiddingsFlow, type BidRow } from '$utils/flows/getBiddingsFlow';
	import { createEventDispatcher, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import AuctionBidRow from './AuctionBidRow.svelte';

	const dispatch = createEventDispatcher();

	export let listingId: string = null;
	export let biddings: BidRow[] = [];
	export let isRefreshing = false;

	async function refresh() {
		isRefreshing = true;

		biddings = await getBiddingsFlow(listingId);

		isRefreshing = false;
	}

	function onRefreshClick() {
		if (listingId) {
			refresh();
		} else {
			dispatch('request-refresh');
		}
	}

	onMount(async () => {
		if (listingId) {
			refresh();
		}
	});
</script>

<div class="relative flex flex-col h-full p-4 overflow-hidden border rounded-lg">
	<div class="flex">
		<div class="font-medium opacity-70 flex-grow">Bids</div>
		<button class="opacity-70 active:opacity-50 transition" on:click={onRefreshClick}><Refresh class="scale-75" /></button>
	</div>

	<div class="flex flex-col flex-grow gap-4 pr-4 mt-4 overflow-y-scroll blue-scrollbar">
		{#each biddings as bid}
			<AuctionBidRow {...bid} tokenIconComponent={Eth} />
		{/each}

		{#if !biddings.length}
			<div class="grid h-full pb-8 text-sm font-semibold opacity-50 place-items-center">This auction doesn't have any bids yet.</div>
		{/if}
	</div>

	{#if isRefreshing}
		<div class="absolute bottom-0 left-0 w-full px-4 pt-3 pb-2 text-xs font-semibold bg-gray-100 rounded-t-sm" transition:slide|local>Refreshing...</div>
	{/if}
</div>
