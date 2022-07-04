<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import AuctionBidList from '$lib/components/v2/AuctionBidList/AuctionBidList.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import Input from '$lib/components/v2/Input/Input.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import { hasEnoughBalance } from '$utils/contracts/token';
	import { getBiddingsFlow, type BidRow } from '$utils/flows/getBiddingsFlow';
	import { placeBidFlow } from '$utils/flows/placeBidFlow';
	import { salePurchase } from '$utils/flows/salePurchase';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { createToggle } from '$utils/misc/toggle';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import dayjs from 'dayjs';
	import { BigNumber } from 'ethers';
	import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
	import { noTry, noTryAsync } from 'no-try';
	import { createEventDispatcher, onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;

	$: listingExpired = dayjs(options.listingData.startTime).add(options.listingData.duration, 'seconds').isBefore(dayjs());

	const purchasingState = writable(null);

	// Sale listing type
	async function handlePurchase() {
		purchasingState.set('waiting-contract');

		const price = options.saleData.price.toString();
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

		const [err, res] = await noTryAsync(async () => await placeBidFlow(options.rawResourceData.listingId, bidAmount));

		await refreshBids();

		bidAmount = '';

		isPlacingBid = false;
	}

	let biddings: BidRow[] = [];

	function bidValidator(v: string): boolean {
		const [valueErr, parsedValue] = noTry(() => parseUnits(v, options.listingData.tokenDecimals));

		if (valueErr) return false;

		// HOTFIX we will use the startingPrice as a reserve price for now
		const [reservePriceErr, parsedReservePrice] = noTry(() => BigNumber.from(options.auctionData.startingPrice));

		// parseUnits because tokenAmount is a ETH formatted string
		const [highestBidErr, parsedHighestBid] = noTry(() => parseUnits(biddings[0].tokenAmount, options.listingData.tokenDecimals));

		if (parsedReservePrice && parsedValue.lte(parsedReservePrice)) {
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

	onMount(async () => {
		if (options.rawResourceData.listingType === 'auction') {
			await refreshBids();
		}
	});

	$: formattedPrice = noTry(() => formatUnits(options.auctionData.startingPrice, options.listingData.tokenDecimals))[1] || 'N/A';

	const hoveringPurchase = createToggle();
	let purchaseButton: HTMLElement;

	const hasEnoughTokens = derived(
		currentUserAddress,
		(address, set) => {
			if (options.listingData.listingType !== 'sale') {
				set(false);
				return;
			}
			hasEnoughBalance(options.listingData.tokenAddress, address, options.saleData.price).then(set);
		},
		null
	);
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
			{#if $appSigner}
				<button
					bind:this={purchaseButton}
					on:pointerenter={hoveringPurchase.toggle}
					on:pointerleave={hoveringPurchase.toggle}
					class="font-bold uppercase btn btn-gradient btn-rounded w-80"
					on:click={handlePurchase}
					disabled={$purchasingState || !$hasEnoughTokens}
				>
					{#if $purchasingState || $hasEnoughTokens === null}
						<ButtonSpinner />
					{/if}
					Buy Now
				</button>
			{:else}
				<button bind:this={purchaseButton} class="font-bold uppercase btn btn-gradient btn-rounded w-80" on:click={connectToWallet}>Connect To Wallet</button>
			{/if}
		</div>
	{:else if options.rawResourceData.listingType === 'auction'}
		<div class="flex flex-col h-full mt-4">
			<AuctionBidList {biddings} isRefreshing={isRefreshingBids} tokenDecimals={options.listingData.tokenDecimals} on:request-refresh={refreshBids} />

			<div class="mt-2 text-xs font-semibold opacity-70">
				Reserve price: {formattedPrice}
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
	{/if}
</div>

{#if $hoveringPurchase && $hasEnoughTokens === false}
	<AttachToElement to={purchaseButton} bottom offsetY={20}>
		<InfoBubble>You do not have enough {options.listingData.symbol} to purchase this item.</InfoBubble>
	</AttachToElement>
{/if}
