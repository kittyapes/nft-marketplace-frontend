<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import AuctionBidList from '$lib/components/v2/AuctionBidList/AuctionBidList.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import type { BidRow } from '$utils/flows/getBiddingsFlow';

	export let options: CardPopupOptions;

	let biddings: BidRow[];

	$: console.log('biddings', biddings);
</script>

<div class="flex flex-col h-full pb-12 mt-4">
	<AuctionBidList listingId={options.rawResourceData.listingId} bind:biddings />
	<PrimaryButton class="mt-4" disabled={!biddings?.length}>Accept Highest Bid</PrimaryButton>
</div>
