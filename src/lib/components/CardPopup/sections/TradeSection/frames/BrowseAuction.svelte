<script lang="ts">
	import EthV2 from '$icons/eth-v2.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import AuctionBidList from '$lib/components/v2/AuctionBidList/AuctionBidList.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import Input from '$lib/components/v2/Input/Input.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import type { ChainListing } from '$utils/contracts/listing';
	import { getBiddingsFlow, type BidRow } from '$utils/flows/getBiddingsFlow';
	import { placeBidFlow } from '$utils/flows/placeBidFlow';
	import { parseToken } from '$utils/misc/priceUtils';
	import { isFuture } from '$utils/misc/time';
	import { notifyError } from '$utils/toast';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { noTryAsync } from 'no-try';
	import { onMount } from 'svelte';

	export let options: CardOptions;
	export let chainListing: ChainListing;
	export let listedNfts: number;

	$: listingExpired = !isFuture(options.listingData.endTime);

	let bidAmount: string;
	let bidAmountValid: boolean;

	let isPlacingBid = false;

	async function placeBid() {
		isPlacingBid = true;

		const [err, res] = await noTryAsync(async () => await placeBidFlow(options.rawResourceData.listingId, bidAmount));

		if (err) {
			notifyError('Failed to place your bid!');
		} else {
			setTimeout(async () => await refreshBids(), 10000);
			bidAmount = '';
		}

		isPlacingBid = false;
	}

	let biddings: BidRow[] = [];

	function bidValidator(v: string): boolean {
		const parsedValue = parseToken(v, chainListing.payToken, null);
		const parsedPrice = parseToken(chainListing.price, chainListing.payToken, null);
		const parsedHighestBid = parseToken(biddings?.[0]?.tokenAmount || '0', chainListing.payToken, null);

		if ([parsedValue, parsedPrice, parsedHighestBid].some((v) => !v)) {
			return false;
		}

		if (parsedValue.lt(parsedPrice)) {
			return false;
		}

		if (parsedHighestBid && parsedValue.lte(parsedHighestBid)) {
			return false;
		}

		if ($currentUserAddress && $currentUserAddress.toLowerCase() === biddings[0]?.bidderAddress) {
			bidError = 'You are already the top bidder.';
			return false;
		}

		return true;
	}

	let isRefreshingBids = false;

	async function refreshBids() {
		isRefreshingBids = true;
		biddings = await getBiddingsFlow(options.rawResourceData.listingId);
		isRefreshingBids = false;
	}

	onMount(refreshBids);

	$: bidError = isFuture(chainListing.startTime) && "Auction hasn't started yet.";

	let hoveringPlaceBid;
</script>

<div class="flex flex-col justify-center h-[90%] pr-1 text-white">
	<div class="flex flex-col h-full mt-4">
		<div class="min-h-[300px] flex-grow">
			<AuctionBidList {biddings} isRefreshing={isRefreshingBids} on:request-refresh={refreshBids} />
		</div>

		<div class="flex items-center justify-between my-4">
			<div class="font-semibold">
				<div class="">Quantity</div>
				<div class="flex items-center justify-start gap-2">
					{listedNfts}
				</div>
			</div>

			<div class="font-semibold">
				<div class="">Starting price</div>
				<div class="flex items-center justify-end gap-2 {(options?.auctionData?.formatStartingPrice || options?.auctionData?.startingPrice || 'N/A').toString().length > 12 ? 'text-xs' : 'text-base'}">
					<EthV2 />
					{options?.auctionData?.formatStartingPrice || options?.auctionData?.startingPrice || 'N/A'}
				</div>
			</div>
		</div>

		<div class="flex gap-2">
			<button class="grid w-12 h-12 p-2 border place-items-center" disabled><EthV2 /></button>
			<Input class="border border-opacity-20" placeholder="Enter amount" bind:value={bidAmount} validator={bidValidator} bind:valid={bidAmountValid} disabled={listingExpired} />
		</div>

		<div class="flex gap-2 mt-4">
			{#if $appSigner}
				<div class="relative w-full" on:pointerover={() => (hoveringPlaceBid = true)} on:pointerleave={() => (hoveringPlaceBid = false)}>
					<PrimaryButton on:click={placeBid} disabled={!bidAmountValid || !bidAmount || listingExpired || isPlacingBid || !!bidError || !chainListing.isValidOnChainListing}>
						{#if isPlacingBid}
							<ButtonSpinner />
						{/if}
						Place Bid
					</PrimaryButton>

					{#if hoveringPlaceBid && bidError && chainListing.isValidOnChainListing}
						<div class="absolute top-4">
							<InfoBubble>{bidError}</InfoBubble>
						</div>
					{/if}
					{#if hoveringPlaceBid && !chainListing.isValidOnChainListing}
						<div class="absolute top-4">
							<InfoBubble>Sorry, this listing is no longer valid</InfoBubble>
						</div>
					{/if}
				</div>
			{:else}
				<PrimaryButton on:click={connectToWallet}>Connect To Wallet</PrimaryButton>
			{/if}
		</div>
	</div>
</div>
