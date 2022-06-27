<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import { getBiddingsFlow, type BidRow } from '$utils/flows/getBiddingsFlow';
	import { onMount } from 'svelte';
	import AuctionBidRow from './AuctionBidRow.svelte';

	export let listingId: string = null;
	export let biddings: BidRow[] = [];

	onMount(async () => {
		if (listingId) {
			biddings = await getBiddingsFlow(listingId);
		}
	});
</script>

<div class="flex flex-col flex-grow p-4 overflow-hidden border rounded-lg">
	<div class="font-medium opacity-70">Bids</div>
	<div class="flex flex-col flex-grow gap-4 pr-4 mt-4 overflow-y-scroll">
		{#each biddings as bid}
			<AuctionBidRow {...bid} tokenIconComponent={Eth} />
		{/each}

		{#if !biddings.length}
			<div class="grid h-full pb-8 text-sm font-semibold opacity-50 place-items-center">This auction doesn't have any bids yet.</div>
		{/if}
	</div>
</div>
