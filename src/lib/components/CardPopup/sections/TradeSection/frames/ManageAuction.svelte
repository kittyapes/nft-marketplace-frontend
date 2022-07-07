<script lang="ts">
	import Eth from '$icons/eth.svelte';

	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import AuctionBidList from '$lib/components/v2/AuctionBidList/AuctionBidList.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import { contractCompleteAuction } from '$utils/contracts/auction';
	import { contractCancelListing } from '$utils/contracts/listing';
	import type { BidRow } from '$utils/flows/getBiddingsFlow';
	import { createToggle } from '$utils/misc/toggle';
	import { notifyError } from '$utils/toast';
	import dayjs from 'dayjs';
	import { noTryAsync } from 'no-try';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;

	$: listingExpired = dayjs(options.listingData.startTime).add(options.listingData.duration, 'seconds').isBefore(dayjs());

	let biddings: BidRow[];

	let isCompletingAuction = false;
	let completedAuction = false;

	async function acceptHighest() {
		isCompletingAuction = true;

		const { err, res } = await contractCompleteAuction(options.listingData.onChainId);

		if (err) {
			console.error(err);
			notifyError('Failed to complete auction.');
		} else {
			completedAuction = true;
		}

		isCompletingAuction = false;
	}

	let cancelButtonContainer: HTMLElement;
	let isCancellingAuction = createToggle();

	async function cancelAuction() {
		isCancellingAuction.toggle();

		const [err, res] = await noTryAsync(() => contractCancelListing(options.listingData.onChainId));

		if (err) {
			console.error(err);
			notifyError('Failed to cancel listing.');
			dispatch('set-state', { name: 'error', props: { showProfileButton: false, showMarketplaceButton: false, successDescription: 'Listing cancelled successfully.' } });
		} else {
			options.staleResource.set({ reason: 'cancelled' });
			dispatch('set-state', { name: 'success', props: { showProfileButton: false, showMarketplaceButton: false, successDescription: 'Listing cancelled successfully.' } });
		}

		isCancellingAuction.toggle();
	}

	const cancelHovered = createToggle();

	let isRefreshingBids: boolean;
</script>

<div class="flex flex-col h-full pb-12 mt-4">
	<AuctionBidList listingId={options.rawResourceData.listingId} bind:biddings bind:isRefreshing={isRefreshingBids} tokenDecimals={options.listingData.tokenDecimals} />

	<div class="mt-2 font-semibold flex">
		<div class="flex flex-col font-semibold">
			<div class="">Reserve price</div>
			<div class="flex items-center gap-2">
				<Eth />
				{options.auctionData.reservePrice || 'N/A'}
			</div>
		</div>

		<div class="flex-grow" />

		<div class="flex flex-col font-semibold">
			<div class="">Starting price</div>
			<div class="flex items-center gap-2">
				<Eth />
				{options.auctionData.startingPrice || 'N/A'}
			</div>
		</div>
	</div>

	<div class="flex gap-2">
		<div bind:this={cancelButtonContainer} class="w-full" on:pointerenter={cancelHovered.toggle} on:pointerleave={cancelHovered.toggle}>
			<SecondaryButton class="mt-4" disabled={$isCancellingAuction || biddings?.length || isRefreshingBids} on:click={cancelAuction}>
				{#if $isCancellingAuction}
					<ButtonSpinner secondary />
				{/if}
				Cancel Auction
			</SecondaryButton>
		</div>

		<PrimaryButton class="mt-4" disabled={!biddings?.length || isCompletingAuction || completedAuction || !listingExpired} on:click={acceptHighest}>
			{#if isCompletingAuction}
				<ButtonSpinner />
			{/if}
			Accept Highest Bid
		</PrimaryButton>
	</div>
</div>

{#if $cancelHovered && biddings?.length}
	<AttachToElement to={cancelButtonContainer} bottom>
		<InfoBubble>Your auction can no longer be cancelled because a bid was already made.</InfoBubble>
	</AttachToElement>
{/if}
