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
	import { contractCancelListing, type ChainListing } from '$utils/contracts/listing';
	import type { BidRow } from '$utils/flows/getBiddingsFlow';
	import { parseToken } from '$utils/misc/priceUtils';
	import { createToggle } from '$utils/misc/toggle';
	import { notifyError } from '$utils/toast';
	import { noTryAsync } from 'no-try';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;
	export let chainListing: ChainListing;

	// $: listingExpired = dayjs(options.listingData.startTime).add(options.listingData.duration, 'seconds').isBefore(dayjs());

	let biddings: BidRow[] = [];

	async function acceptHighest() {
		isWorking = true;
		isAccepting = true;

		const { err, res } = await contractCompleteAuction(options.listingData.onChainId);

		if (err) {
			console.error(err);
			notifyError('Failed to complete auction.');
			dispatch('set-state', { name: 'error' });
		} else {
			options.staleResource.set({ reason: 'cancelled' });
			dispatch('set-state', { name: 'success', props: { showProfileButton: false, showMarketplaceButton: false, successDescription: 'Auction completed successfully.' } });
		}

		isWorking = false;
		isAccepting = false;
	}

	let cancelButtonContainer: HTMLElement;

	async function cancelAuction() {
		isWorking = true;
		isCancelling = true;

		const [err, res] = await noTryAsync(() => contractCancelListing(options.listingData.onChainId));

		if (err) {
			console.error(err);
			notifyError('Failed to cancel listing.');
			dispatch('set-state', { name: 'error' });
		} else {
			options.staleResource.set({ reason: 'cancelled' });
			dispatch('set-state', { name: 'success', props: { showProfileButton: false, showMarketplaceButton: false, successDescription: 'Listing cancelled successfully.' } });
		}

		isWorking = false;
		isCancelling = false;
	}

	const cancelHovered = createToggle();

	let isRefreshingBids: boolean;

	let isWorking = false;
	let isAccepting = false;
	let isCancelling = false;

	$: highestAmount = biddings[0] && parseToken(biddings[0].tokenAmount, chainListing.payToken);

	// prettier-ignore
	$: canCancel = [
		biddings.length < 1,
		highestAmount && highestAmount.lt(parseToken(chainListing.reservePrice, chainListing.payToken))
	].some((v) => v);

	$: canAccept = [biddings.length > 0].some((v) => v);
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
			<SecondaryButton class="mt-4" disabled={isWorking || isRefreshingBids || !canCancel} on:click={cancelAuction}>
				{#if isCancelling}
					<ButtonSpinner secondary />
				{/if}
				Cancel Auction
			</SecondaryButton>
		</div>

		<PrimaryButton class="mt-4" disabled={isWorking || isRefreshingBids || !canAccept} on:click={acceptHighest}>
			{#if isAccepting}
				<ButtonSpinner />
			{/if}
			Accept Highest Bid
		</PrimaryButton>
	</div>
</div>

{#if $cancelHovered && !canCancel}
	<AttachToElement to={cancelButtonContainer} bottom>
		<InfoBubble>Your auction is no longer cancellable.</InfoBubble>
	</AttachToElement>
{/if}
