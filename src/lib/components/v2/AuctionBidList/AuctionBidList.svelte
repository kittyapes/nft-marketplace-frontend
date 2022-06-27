<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import { getBiddingsFlow, type BidRow } from '$utils/flows/getBiddingsFlow';
	import { onMount } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import AuctionBidRow from './AuctionBidRow.svelte';

	export let listingId: string = null;
	export let biddings: BidRow[] = [];
	export let isRefreshing = false;

	onMount(async () => {
		if (listingId) {
			isRefreshing = true;

			biddings = await getBiddingsFlow(listingId);

			isRefreshing = false;
		}
	});
</script>

<div class="relative flex flex-col flex-grow p-4 overflow-hidden border rounded-lg">
	<div class="font-medium opacity-70">Bids</div>
	<div class="flex flex-col flex-grow gap-4 pr-4 mt-4 overflow-y-scroll">
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
