<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import AuctionBidList from '$lib/components/v2/AuctionBidList/AuctionBidList.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import Input from '$lib/components/v2/Input/Input.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import type { ChainListing } from '$utils/contracts/listing';
	import { getBiddingsFlow, type BidRow } from '$utils/flows/getBiddingsFlow';
	import { placeBidFlow } from '$utils/flows/placeBidFlow';
	import { parseToken } from '$utils/misc/priceUtils';
	import { notifyError } from '$utils/toast';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import dayjs from 'dayjs';
	import { noTryAsync } from 'no-try';
	import { onMount } from 'svelte';

	export let options: CardPopupOptions;
	export let chainListing: ChainListing;

	$: listingExpired = dayjs(options.listingData.startTime).add(options.listingData.duration, 'seconds').isBefore(dayjs());

	let bidAmount: string;
	let bidAmountValid: boolean;

	let isPlacingBid = false;

	async function placeBid() {
		isPlacingBid = true;

		const [err, res] = await noTryAsync(async () => await placeBidFlow(options.rawResourceData.listingId, bidAmount));

		if (err) {
			notifyError('Failed to place your bid!');
		} else {
			await refreshBids();
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

		return true;
	}

	let isRefreshingBids = false;

	async function refreshBids() {
		isRefreshingBids = true;
		biddings = await getBiddingsFlow(options.rawResourceData.listingId, options.listingData.tokenDecimals);
		isRefreshingBids = false;
	}

	onMount(refreshBids);
</script>

<div class="flex flex-col justify-center h-[90%]">
	<div class="flex flex-col h-full mt-4">
		<AuctionBidList {biddings} isRefreshing={isRefreshingBids} tokenDecimals={options.listingData.tokenDecimals} on:request-refresh={refreshBids} />

		<div class="my-4 font-semibold ml-auto">
			<div class="">Starting price</div>
			<div class="flex items-center gap-2 justify-end">
				<Eth />
				{chainListing.price || 'N/A'}
			</div>
		</div>

		<div class="flex gap-2">
			<button class="grid w-12 h-12 p-2 border rounded-lg place-items-center" disabled><Eth /></button>
			<Input class="border-opacity-20" placeholder="Enter amount" bind:value={bidAmount} validator={bidValidator} bind:valid={bidAmountValid} disabled={listingExpired} />
		</div>

		<div class="flex gap-2 mt-4">
			{#if $appSigner}
				{#if false}
					<SecondaryButton>Cancel Bid</SecondaryButton>
				{/if}

				<PrimaryButton on:click={placeBid} disabled={!bidAmountValid || !bidAmount || listingExpired || isPlacingBid}>
					{#if isPlacingBid}
						<ButtonSpinner />
					{/if}
					Place Bid
				</PrimaryButton>
			{:else}
				<PrimaryButton on:click={connectToWallet}>Connect To Wallet</PrimaryButton>
			{/if}
		</div>
	</div>
</div>
