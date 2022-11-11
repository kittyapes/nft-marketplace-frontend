<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import type { ChainListing } from '$utils/contracts/listing';
	import { hasEnoughBalance } from '$utils/contracts/token';
	import { salePurchase } from '$utils/flows/salePurchase';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { scientificToDecimal } from '$utils/misc/scientificToDecimal';
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

<div class="flex flex-col text-white aspect-1 pb-px">
	<div class="text-gradient">Buy the NFT</div>
	<div class="mt-1">Click BUY NOW button to own this NFT</div>

	<div class="text-gradient mt-4">Price</div>
	<div class="flex gap-2 items-center">
		<Eth gradient />

		<div class="font-light text-sm">
			<span class="text-2xl ">{scientificToDecimal(options.saleData?.formatPrice)}</span>
			wETH
		</div>
	</div>

	<div class="text-gradient mt-4">Quantity</div>
	<div class="mt-1 pl-1 text-2xl">{chainListing?.quantity ?? options?.rawResourceData?.listing?.quantity ?? options?.nfts[0]?.quantity ?? '1'}</div>

	<div class="flex-grow" />

	<div class="grid mt-12 place-items-center">
		{#if $appSigner}
			<div class="relative w-full">
				<PrimaryButton
					on:pointerenter={() => (hoveringPurchase = true)}
					on:pointerleave={() => (hoveringPurchase = false)}
					on:click={handlePurchase}
					disabled={purchasing || !!purchaseError || !chainListing.isValidOnChainListing}
				>
					{#if purchasing || $hasEnoughTokens === null}
						<ButtonSpinner />
					{/if}
					Buy Now
				</PrimaryButton>

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
			<PrimaryButton on:click={connectToWallet}>Connect To Wallet</PrimaryButton>
		{/if}
	</div>
</div>
