<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import AuctionBidList from '$lib/components/v2/AuctionBidList/AuctionBidList.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { contractCompleteAuction } from '$utils/contracts/auction';
	import type { BidRow } from '$utils/flows/getBiddingsFlow';
	import { notifyError } from '$utils/toast';
	import dayjs from 'dayjs';

	export let options: CardPopupOptions;

	$: listingExpired = dayjs(options.listingData.startTime).add(options.listingData.duration, 'seconds').isBefore(dayjs());

	let biddings: BidRow[];

	let isCompletingAuction = false;

	async function acceptHighest() {
		isCompletingAuction = true;

		const { err, res } = await contractCompleteAuction(options.listingData.onChainId);

		if (err) {
			console.error(err);
			notifyError('Failed to complete auction.');
		}

		isCompletingAuction = false;
	}
</script>

<div class="flex flex-col h-full pb-12 mt-4">
	<AuctionBidList listingId={options.rawResourceData.listingId} bind:biddings />
	<PrimaryButton class="mt-4" disabled={!biddings?.length || !listingExpired || isCompletingAuction} on:click={acceptHighest}>
		{#if isCompletingAuction}
			<ButtonSpinner />
		{/if}
		Accept Highest Bid
	</PrimaryButton>
</div>
