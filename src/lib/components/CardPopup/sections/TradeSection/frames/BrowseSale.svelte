<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import type { ChainListing } from '$utils/contracts/listing';
	import { hasEnoughBalance } from '$utils/contracts/token';
	import { salePurchase } from '$utils/flows/salePurchase';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { isFuture } from '$utils/misc/time';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { createEventDispatcher } from 'svelte';
	import { derived } from 'svelte/store';
	import Success from './Success.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;
	export let chainListing: ChainListing;

	let hoveringPurchase = false;
	let purchasing = false;

	async function handlePurchase() {
		purchasing = true;

		const price = options.saleData.price.toString();
		const success = await salePurchase(options.listingData.onChainId, price);

		if (success) {
			dispatch('set-frame', { component: Success });
			dispatch('force-expire');
		}

		purchasing = false;
	}

	const hasEnoughTokens = derived(
		currentUserAddress,
		(address, set) => {
			hasEnoughBalance(chainListing.payToken, address, options.saleData.formatPrice).then(set);
		},
		null,
	);

	// prettier-ignore
	$: purchaseError =
		(isFuture(chainListing.startTime) && "This listing isn't for sale yet.") ||
		!$hasEnoughTokens 				  && `You do not have enough ${options.listingData.paymentTokenTicker} to purchase this item.`;
</script>

<div class="flex flex-col justify-center h-full pb-16">
	<img class="h-24" src={getIconUrl('cart')} alt="" />

	<div class="text-2xl font-bold text-center opacity-70">Buy the NFT</div>
	<div class="mt-4 text-center opacity-50">Click buy now button to own this NFT</div>

	<div class="mt-8 font-bold text-center opacity-50">Price:</div>
	<div class="flex items-center justify-center mt-2">
		<img src={getIconUrl('eth')} alt="" />
		<div class="{(options.saleData?.formatPrice || options.saleData?.price || 'N/A').toString().length > 12 ? 'text-3xl' : 'text-5xl'} font-bold">
			{options.saleData?.formatPrice || options.saleData?.price || 'N/A'}
		</div>
		<div class="grid h-full ml-2 font-bold opacity-70 place-items-end">wETH</div>
	</div>

	<div class="mt-8 font-bold text-center opacity-50">Quantity:</div>
	<div class="flex items-center justify-center mt-2">
		<div class="{(options?.rawResourceData?.listing?.quantity ?? options?.nfts[0]?.quantity) > 10000000000000 ? 'text-3xl' : 'text-5xl'} font-bold">
			{chainListing?.quantity ?? options?.rawResourceData?.listing?.quantity ?? options?.nfts[0]?.quantity ?? '1'}
		</div>
	</div>

	<div class="grid mt-12 place-items-center">
		{#if $appSigner}
			<div class="relative">
				<button
					on:pointerenter={() => (hoveringPurchase = true)}
					on:pointerleave={() => (hoveringPurchase = false)}
					class="font-bold uppercase btn btn-gradient btn-rounded w-80"
					on:click={handlePurchase}
					disabled={purchasing || !!purchaseError || !chainListing.isValidOnChainListing}
				>
					{#if purchasing || $hasEnoughTokens === null}
						<ButtonSpinner />
					{/if}
					Buy Now
				</button>

				{#if hoveringPurchase && purchaseError && chainListing.isValidOnChainListing}
					<div class="absolute top-12">
						<InfoBubble>{purchaseError}</InfoBubble>
					</div>
				{/if}

				{#if hoveringPurchase && !chainListing.isValidOnChainListing}
					<div class="absolute top-12">
						<InfoBubble>Sorry, this listing is no longer valid</InfoBubble>
					</div>
				{/if}
			</div>
		{:else}
			<button class="font-bold uppercase btn btn-gradient btn-rounded w-80" on:click={connectToWallet}>Connect To Wallet</button>
		{/if}
	</div>
</div>
