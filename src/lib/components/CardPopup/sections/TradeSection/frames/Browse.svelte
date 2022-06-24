<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import CircularSpinner from '$lib/components/spinners/CircularSpinner.svelte';
	import AuctionBidList from '$lib/components/v2/AuctionBidList/AuctionBidList.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import Input from '$lib/components/v2/Input/Input.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { getBiddingsFlow, type BidRow } from '$utils/flows/getBiddingsFlow';
	import { placeBidFlow } from '$utils/flows/placeBidFlow';
	import { salePurchase } from '$utils/flows/salePurchase';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import dayjs from 'dayjs';
	import { BigNumber, errors, ethers } from 'ethers';
	import { formatEther, parseEther } from 'ethers/lib/utils.js';
	import { noTry, noTryAsync } from 'no-try';
	import { createEventDispatcher, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;

	$: listingExpired = dayjs(options.listingData.startTime).add(options.listingData.duration, 'seconds').isBefore(dayjs());

	const purchasingState = writable(null);

	// Sale listing type
	async function handlePurchase() {
		purchasingState.set('waiting-contract');

		const price = parseEther(options.saleData.price.toString());
		const success = await salePurchase(options.saleData.listingId, price);

		success ? dispatch('set-state', { name: 'success' }) : dispatch('set-state', { name: 'error' });

		purchasingState.set(null);
	}

	// Auction listing type
	let bidAmount: string;
	let bidAmountValid: boolean;

	let isPlacingBid = false;

	async function placeBid() {
		isPlacingBid = true;

		const [err, res] = await noTryAsync(async () => await placeBidFlow(options.rawResourceData.listingId, parseEther(bidAmount)));

		isPlacingBid = false;
	}

	let biddings: BidRow[] = [];

	function bidValidator(v: string): boolean {
		const [valueErr, parsedValue] = noTry(() => parseEther(v));

		if (valueErr) return false;

		// HOTFIX we will use the startingPrice as a reserve price for now
		const [reservePriceErr, parsedReservePrice] = noTry(() => BigNumber.from(options.auctionData.startingPrice));

		// parseEther because tokenAmount is a ETH formatted string
		const [highestBidErr, parsedHighestBid] = noTry(() => parseEther(biddings[0].tokenAmount));

		if (parsedReservePrice && parsedValue.lte(parsedReservePrice)) {
			return false;
		}

		if (parsedHighestBid && parsedValue.lte(parsedHighestBid)) {
			return false;
		}

		return true;
	}

	onMount(async () => {
		if (options.rawResourceData.listingType === 'auction') {
			biddings = await getBiddingsFlow(options.rawResourceData.listingId);
		}
	});
</script>

<div class="flex flex-col justify-center h-[90%]">
	{#if options.listingData.sellerAddress === $currentUserAddress}
		<div class="h-full pt-4">
			<InfoBox>You currently cannot interact with this listing, because you are the one who created it.</InfoBox>
		</div>
	{:else if options.rawResourceData.listingType === 'sale'}
		<img class="h-24" src={getIconUrl('cart')} alt="" />

		<div class="text-2xl font-bold text-center opacity-70">Buy the NFT</div>
		<div class="mt-4 text-center opacity-50">Click buy now button to own this NFT</div>

		<div class="mt-8 font-bold text-center opacity-50">Price:</div>
		<div class="flex items-center justify-center mt-2">
			<img src={getIconUrl('eth')} alt="" />
			<div class="text-5xl font-bold">{options.saleData?.price || 'N/A'}</div>
			<div class="grid h-full ml-2 font-bold opacity-70 place-items-end">ETH</div>
		</div>

		<div class="grid mt-12 place-items-center">
			<button class="font-bold uppercase btn btn-gradient btn-rounded w-80" on:click={handlePurchase} disabled={$purchasingState}>
				{#if $purchasingState}
					<div class="absolute top-0 bottom-0 w-8 h-8 my-auto -ml-6">
						<CircularSpinner />
					</div>
				{/if}
				Buy Now
			</button>
		</div>
	{:else if options.rawResourceData.listingType === 'auction'}
		<div class="flex flex-col h-full mt-4">
			<AuctionBidList listingId={options.rawResourceData.listingId} />

			<div class="mt-2 font-semibold opacity-70 text-xs">
				Reserve price: {formatEther(options.auctionData.startingPrice)}
				{options.listingData.symbol}

				{#if listingExpired}
					| <span class="text-red-800">EXPIRED</span>
				{/if}

				<!-- | Reserve price: {formatEther(options.auctionData.reservePrice) || 'N/A'}
				{options.listingData.symbol} -->
			</div>

			<div class="flex gap-2 mt-2">
				<button class="grid w-12 h-12 p-2 border rounded-lg place-items-center" disabled><Eth /></button>
				<Input class="border-opacity-20" placeholder="Enter amount" bind:value={bidAmount} validator={bidValidator} bind:valid={bidAmountValid} disabled={listingExpired} />
			</div>

			<div class="flex gap-2 mt-4">
				{#if false}
					<SecondaryButton>Cancel Bid</SecondaryButton>
				{/if}

				<PrimaryButton on:click={placeBid} disabled={!bidAmountValid || !bidAmount || listingExpired || isPlacingBid}>
					{#if isPlacingBid}
						<ButtonSpinner />
					{/if}
					Place Bid
				</PrimaryButton>
			</div>
		</div>
	{/if}
</div>
