<script lang="ts">
	import EthV2 from '$icons/eth-v2.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import AuctionBidList from '$lib/components/v2/AuctionBidList/AuctionBidList.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import { getBiddingsFlow, type BidRow } from '$utils/flows/getBiddingsFlow';
	import { placeBidFlow } from '$utils/flows/placeBidFlow';
	import { dateToTimestamp, isListingValid } from '$utils/listings';
	import { parseToken } from '$utils/misc/priceUtils';
	import { isFuture } from '$utils/misc/time';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { BigNumber } from 'ethers';
	import { onMount } from 'svelte';
	import type { AuctionDataModel } from '$interfaces/index';
	import { HandledError } from '$utils';
	import { ethAmountRegex, regexFilter } from '$actions/regexFilter';

	export let options: CardOptions;

	$: auctionData = options.rawListingData.listing as AuctionDataModel;

	// User input in ETH
	let bidAmount: number;
	let bidAmountValid: boolean;

	let isPlacingBid = false;

	async function placeBid() {
		isPlacingBid = true;

		// Parse bid amount
		let bidBigNumber: BigNumber;

		try {
			bidBigNumber = parseToken(bidAmount.toString(), options.rawListingData.paymentTokenAddress);
		} catch {
			notifyError('Failed to convert bid amount.');

			isPlacingBid = false;
		}

		try {
			await placeBidFlow(options.rawListingData, bidBigNumber);
		} catch (err) {
			if (err instanceof HandledError) {
				return;
			}

			console.error(err);
			notifyError('An unexpected error has occured. Failed to place your bid.');

			return;
		} finally {
			isPlacingBid = false;
		}

		notifySuccess(`Successfully placed your bid of ${bidAmount} WETH.`);
		setTimeout(async () => await refreshBids(), 10000);
		bidAmount = null;
	}

	let biddings: BidRow[] = [];

	function bidValidator(v: string): boolean {
		if (!v) {
			return true;
		}

		const payTokenAddress = options.rawListingData.paymentTokenAddress;

		const parsedValue = parseToken(v, payTokenAddress, null);
		const parsedPrice = BigNumber.from(auctionData.startingPrice);
		const parsedHighestBid = parseToken(biddings?.[0]?.tokenAmount || '0', payTokenAddress, null);

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

	$: bidAmountValid = bidAmount && bidValidator(bidAmount.toString());

	let isRefreshingBids = false;

	async function refreshBids() {
		isRefreshingBids = true;
		biddings = await getBiddingsFlow(options.rawResourceData.listingId);
		isRefreshingBids = false;
	}

	onMount(refreshBids);

	$: bidError =
		isFuture(dateToTimestamp(options.rawListingData.startTime)) && "Auction hasn't started yet.";

	let hoveringPlaceBid;
</script>

<div class="flex flex-col justify-center pr-1 text-white aspect-1">
	<div class="flex-grow">
		<AuctionBidList {biddings} isRefreshing={isRefreshingBids} on:request-refresh={refreshBids} />
	</div>

	<div class="flex items-center justify-between my-4">
		<div class="font-semibold">
			<div class="">Quantity</div>
			<div class="flex items-center justify-start gap-2">
				{options.rawListingData.nfts[0].amount}
			</div>
		</div>

		<div class="font-semibold">
			<div class="">Starting price</div>
			<div
				class="flex items-center justify-end gap-2 {(
					options?.auctionData?.formatStartingPrice ||
					options?.auctionData?.startingPrice ||
					'N/A'
				).toString().length > 12
					? 'text-xs'
					: 'text-base'}"
			>
				<EthV2 />
				{options?.auctionData?.formatStartingPrice || options?.auctionData?.startingPrice || 'N/A'}
			</div>
		</div>
	</div>

	<div class="flex gap-2">
		<button class="grid w-12 h-12 p-2 border place-items-center" disabled><EthV2 /></button>
		<input
			class="input w-full"
			type="number"
			placeholder="Enter amount"
			bind:value={bidAmount}
			disabled={!isListingValid(options.rawListingData)}
			use:regexFilter={{ regex: ethAmountRegex }}
			class:invalid={!bidAmountValid && bidAmount}
		/>
	</div>

	<div class="flex gap-2 mt-4">
		{#if $appSigner}
			<div
				class="relative w-full"
				on:pointerover={() => (hoveringPlaceBid = true)}
				on:pointerleave={() => (hoveringPlaceBid = false)}
			>
				<PrimaryButton
					on:click={placeBid}
					disabled={!bidAmountValid ||
						!bidAmount ||
						isPlacingBid ||
						!!bidError ||
						!isListingValid(options.rawListingData)}
				>
					{#if isPlacingBid}
						<ButtonSpinner />
					{/if}
					Place Bid
				</PrimaryButton>

				{#if hoveringPlaceBid && bidError && isListingValid(options.rawListingData)}
					<div class="absolute top-4">
						<InfoBubble>{bidError}</InfoBubble>
					</div>
				{/if}

				{#if hoveringPlaceBid && !isListingValid(options.rawListingData)}
					<div class="absolute top-4">
						<InfoBubble>Sorry, this listing is no longer valid</InfoBubble>
					</div>
				{/if}
			</div>
		{:else}
			<PrimaryButton on:click={connectToWallet}>Connect Wallet</PrimaryButton>
		{/if}
	</div>
</div>
