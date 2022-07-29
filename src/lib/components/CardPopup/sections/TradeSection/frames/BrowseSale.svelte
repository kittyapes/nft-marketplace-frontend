<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';

	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import type { ChainListing } from '$utils/contracts/listing';
	import { hasEnoughBalance } from '$utils/contracts/token';
	import { salePurchase } from '$utils/flows/salePurchase';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { notifyError } from '$utils/toast';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { createEventDispatcher } from 'svelte';
	import { derived } from 'svelte/store';
	import { frame } from '../tradeSection';
	import Success from './Success.svelte';

	export let options: CardOptions;
	export let chainListing: ChainListing;

	let hoveringPurchase = false;
	let purchasing = false;
	let purchaseButton: HTMLElement;

	async function handlePurchase() {
		purchasing = true;

		const price = options.saleData.price.toString();
		const success = await salePurchase(options.listingData.onChainId, price);

		if (success) {
			frame.set(Success);
		}

		purchasing = false;
	}

	const hasEnoughTokens = derived(
		currentUserAddress,
		(address, set) => {
			hasEnoughBalance(chainListing.payToken, address, options.saleData.formatPrice).then(set);
		},
		null
	);
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
		<div class="{options?.nfts[0].quantity > 10000000000000 ? 'text-3xl' : 'text-5xl'} font-bold">{options?.nfts[0].quantity || '1'}</div>
	</div>

	<div class="grid mt-12 place-items-center">
		{#if $appSigner}
			<button
				bind:this={purchaseButton}
				on:pointerenter={() => (hoveringPurchase = true)}
				on:pointerleave={() => (hoveringPurchase = false)}
				class="font-bold uppercase btn btn-gradient btn-rounded w-80"
				on:click={handlePurchase}
				disabled={purchasing || !$hasEnoughTokens}
			>
				{#if purchasing || $hasEnoughTokens === null}
					<ButtonSpinner />
				{/if}
				Buy Now
			</button>
		{:else}
			<button bind:this={purchaseButton} class="font-bold uppercase btn btn-gradient btn-rounded w-80" on:click={connectToWallet}>Connect To Wallet</button>
		{/if}
	</div>

	{#if hoveringPurchase && $hasEnoughTokens === false}
		<AttachToElement to={purchaseButton} bottom offsetY={20}>
			<InfoBubble>You do not have enough {options.listingData.paymentTokenTicker} to purchase this item.</InfoBubble>
		</AttachToElement>
	{/if}
</div>
