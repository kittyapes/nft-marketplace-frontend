<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import CircularSpinner from '$lib/components/spinners/CircularSpinner.svelte';
	import AuctionBidList from '$lib/components/v2/AuctionBidList.svelte';
	import AuctionBidRow from '$lib/components/v2/AuctionBidRow.svelte';
	import Button from '$lib/components/v2/Button.svelte';
	import Input from '$lib/components/v2/Input.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { getBiddingsFlow, type BidRow } from '$utils/flows/getBiddingsFlow';
	import { placeBidFlow } from '$utils/flows/placeBidFlow';
	import { salePurchase } from '$utils/flows/salePurchase';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { isPrice } from '$utils/validator/isPrice';
	import { ethers } from 'ethers';
	import { parseEther } from 'ethers/lib/utils.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;

	const purchasingState = writable(null);

	// Sale listing type
	async function handlePurchase() {
		purchasingState.set('waiting-contract');

		const price = ethers.utils.parseEther(options.saleData.price.toString());
		const success = await salePurchase(options.saleData.listingId, price);

		success ? dispatch('set-state', { name: 'success' }) : dispatch('set-state', { name: 'error' });

		purchasingState.set(null);
	}

	// Auction listing type
	let bidAmount: string;
	let bidAmountValid: boolean;

	async function placeBid() {
		await placeBidFlow(options.rawResourceData.listingId, parseEther(bidAmount));
	}

	let biddings: BidRow[] = [];

	function bidValidator(v: string): boolean {
		return isPrice(v) && (biddings[0] ? parseEther(v).gt(parseEther(biddings[0].tokenAmount)) : true);
	}

	onMount(async () => {
		if (options.rawResourceData.listingType === 'auction') {
			biddings = await getBiddingsFlow(options.rawResourceData.listingId);
		}
	});

	$: console.log(options.rawResourceData.listingType);
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
		<div class="flex flex-col h-full pb-8 mt-4">
			<AuctionBidList listingId={options.rawResourceData.listingId} />

			<div class="flex gap-2 mt-2">
				<button class="grid w-12 h-12 p-2 border rounded-lg place-items-center" disabled><Eth /></button>
				<Input class="border-opacity-20" placeholder="Enter amount" bind:value={bidAmount} validator={bidValidator} bind:valid={bidAmountValid} />
			</div>

			<div class="flex gap-2 mt-4">
				{#if false}
					<Button borderColor="gradient" textColor="gradient" uppercase>Cancel Bid</Button>
				{/if}
				<Button class="bg-gradient-to-r from-color-purple to-color-blue" uppercase on:click={placeBid} disabled={!bidAmountValid || !bidAmount}>Place Bid</Button>
			</div>
		</div>
	{/if}
</div>
