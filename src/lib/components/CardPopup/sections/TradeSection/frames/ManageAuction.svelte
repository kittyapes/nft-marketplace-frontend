<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import type { CardOptions } from '$interfaces/ui';
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
	import { createEventDispatcher } from 'svelte';
	import { frame } from '../tradeSection';
	import Success from './Success.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;
	export let chainListing: ChainListing;

	// $: listingExpired = dayjs(options.listingData.startTime).add(options.listingData.duration, 'seconds').isBefore(dayjs());

	let biddings: BidRow[] = [];

	async function acceptHighest() {
		isAccepting = true;

		const { err, res } = await contractCompleteAuction(options.listingData.onChainId);

		if (err) {
			console.error(err);
			notifyError('Failed to complete auction.');
		} else {
			options.staleResource.set({ reason: 'bid-accepted' });
			dispatch('set-state', { name: 'success', props: { showProfileButton: false, showMarketplaceButton: false, successDescription: 'Auction completed successfully.' } });
			frame.set(Success);
		}

		isAccepting = false;
	}

	let cancelButtonContainer: HTMLElement;

	async function cancelListing() {
		isCancelling = true;

		try {
			await contractCancelListing(options.listingData.onChainId);
			frame.set(Success);
			options.staleResource.set({ reason: 'cancelled' });
		} catch (err) {
			console.error(err);
			notifyError('Failed to cancel listing!');
		}

		isCancelling = false;
	}

	const cancelHovered = createToggle();

	let isRefreshingBids: boolean;

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
	<AuctionBidList listingId={options.rawResourceData.listingId} bind:biddings bind:isRefreshing={isRefreshingBids} tokenAddress={options.listingData.paymentTokenAddress} />

	<div class="my-4 font-semibold flex">
		<div>
			<div class="">Reserve price</div>
			<div class="flex items-center gap-2">
				<Eth />
				{options.auctionData.reservePrice || 'N/A'}
			</div>
		</div>

		<div class="flex-grow" />

		<div>
			<div class="">Starting price</div>
			<div class="flex items-center gap-2 justify-end">
				<Eth />
				{options.auctionData.startingPrice || 'N/A'}
			</div>
		</div>
	</div>

	<div class="flex gap-2">
		<div bind:this={cancelButtonContainer} class="w-full" on:pointerenter={cancelHovered.toggle} on:pointerleave={cancelHovered.toggle}>
			<SecondaryButton class="mt-4" disabled={isCancelling || isAccepting || isRefreshingBids || !canCancel} on:click={cancelListing}>
				{#if isCancelling}
					<ButtonSpinner secondary />
				{/if}
				Cancel Auction
			</SecondaryButton>
		</div>

		<PrimaryButton class="mt-4" disabled={isCancelling || isAccepting || isRefreshingBids || !canAccept} on:click={acceptHighest}>
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
