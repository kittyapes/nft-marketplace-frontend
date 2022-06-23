<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import AuctionBidList from '$lib/components/v2/AuctionBidList.svelte';
	import Button from '$lib/components/v2/Button.svelte';
	import type { BidRow } from '$utils/flows/getBiddingsFlow';

	export let options: CardPopupOptions;

	let biddings: BidRow[];
</script>

<div class="flex flex-col h-full pb-12 mt-4">
	<AuctionBidList listingId={options.rawResourceData.listingId} bind:biddings />
	<Button class="mt-4 bg-gradient-to-r from-color-purple to-color-blue" disabled={!biddings?.length} uppercase>Accept Highest Bid</Button>
</div>
