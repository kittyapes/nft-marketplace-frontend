<script lang="ts">
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import AuctionBidList from '$lib/components/v2/AuctionBidList/AuctionBidList.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { contractCompleteAuction } from '$utils/contracts/auction';
	import type { BidRow } from '$utils/flows/getBiddingsFlow';
	import { parseToken } from '$utils/misc/priceUtils';
	import { createToggle } from '$utils/misc/toggle';
	import { notifyError } from '$utils/toast';
	import { createEventDispatcher } from 'svelte';
	import Success from './Success.svelte';
	import dayjs from 'dayjs';
	import GhostButton from '$lib/components/v2/GhostButton.svelte';
	import EthV2 from '$icons/eth-v2.svelte';
	import { listingExistsOnChain } from '$utils/listings';
	import { cancelListingFlow } from '$utils/flows/cancelListingFlow';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;

	$: listingExpired = dayjs(options.listingData.startTime * 1000)
		.add(options.listingData.duration, 'seconds')
		.isBefore(dayjs());

	let biddings: BidRow[] = [];

	async function acceptHighest() {
		if (!(await listingExistsOnChain(options.rawListingData.listingId))) {
			notifyError('Failed to Accept Highest Bid: Listing is no longer valid (not on chain)');
			return;
		}

		isAccepting = true;

		const { err, res } = await contractCompleteAuction(options.listingData.onChainId);

		if (err) {
			console.error(err);
			notifyError('Failed to complete auction.');
		} else {
			options.staleResource.set({ reason: 'bid-accepted' });
			dispatch('set-state', { name: 'success', props: { showProfileButton: false, showMarketplaceButton: false, successDescription: 'Auction completed successfully.' } });
			dispatch('force-expire');
			dispatch('set-frame', { component: Success });
		}

		isAccepting = false;
	}

	let cancelButtonContainer: HTMLElement;

	async function cancelListing() {
		if (!(await listingExistsOnChain(options.rawListingData.listingId))) {
			notifyError('Failed to Cancel Listing: Listing is no longer valid (not on chain)');
			return;
		}

		isCancelling = true;

		const cancelSuccess = await cancelListingFlow(options.rawListingData);

		if (cancelSuccess) {
			dispatch('set-frame', { component: Success });
			options.staleResource.set({ reason: 'cancelled' });
			dispatch('force-expire');
		}

		isCancelling = false;
	}

	const cancelHovered = createToggle();

	let isRefreshingBids: boolean;

	let isAccepting = false;
	let isCancelling = false;

	$: payTokenAddress = options.rawListingData.paymentTokenAddress;
	$: price = options.rawListingData.listing.reservePrice;
	$: reservePrice = options.rawListingData.listing.reservePrice;

	$: highestAmount = biddings[0] && parseToken(biddings[0].tokenAmount, payTokenAddress);

	$: canCancel = biddings.length < 1 || (highestAmount && highestAmount.lt(parseToken(reservePrice, payTokenAddress)));
	let canAccept = false;
	$: hasBids = biddings.length > 0;

	$: if (reservePrice === price) {
		canAccept = [biddings.length > 0].some((v) => v);
	} else {
		canAccept = listingExpired || (biddings.length && parseFloat(biddings[0].tokenAmount) >= parseFloat(reservePrice));
	}
</script>

<div class="flex flex-col flex-grow text-white aspect-1">
	<div class="min-h-[300px] flex-grow">
		<AuctionBidList listingId={options.rawResourceData.listingId} bind:biddings bind:isRefreshing={isRefreshingBids} />
	</div>

	<div class="flex my-4 font-semibold">
		<div>
			<div class="">Reserve price</div>
			<div class="flex items-center gap-2">
				<EthV2 />
				{options.auctionData.formatReservePrice}
			</div>
		</div>

		<div class="flex-grow" />

		<div>
			<div class="">Starting price</div>
			<div class="flex items-center justify-end gap-2">
				<EthV2 />
				{options.auctionData.formatStartingPrice}
			</div>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3">
		<div bind:this={cancelButtonContainer} class="w-full" on:pointerenter={cancelHovered.toggle} on:pointerleave={cancelHovered.toggle}>
			<GhostButton class="h-12" disabled={isCancelling || isAccepting || isRefreshingBids || !canCancel} on:click={cancelListing}>
				{#if isCancelling}
					<ButtonSpinner secondary />
				{/if}
				Cancel Auction
			</GhostButton>
		</div>

		<PrimaryButton disabled={!hasBids || isCancelling || isAccepting || isRefreshingBids || !canAccept} on:click={acceptHighest}>
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
