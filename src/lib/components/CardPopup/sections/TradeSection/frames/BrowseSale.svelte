<script lang="ts">
	import EthV2 from '$icons/eth-v2.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import { hasEnoughBalance } from '$utils/contracts/token';
	import { salePurchase } from '$utils/flows/salePurchaseFlow';
	import { dateToTimestamp, listingExistsOnChain } from '$utils/listings';
	import { isListingExpired } from '$utils/misc';
	import { isFuture } from '$utils/misc/time';
	import { notifyError } from '$utils/toast';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { createEventDispatcher, onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import Error from './Error.svelte';
	import Success from './Success.svelte';
	import type { SaleDataModel } from '$interfaces/index';
	import { formatToken } from '$utils/misc/priceUtils';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;

	$: isExpired = isListingExpired(
		options.rawListingData.startTime,
		options.rawListingData.duration,
	);

	let hoveringPurchase = false;
	let purchasing = false;
	let foundOnChain: boolean;

	const isGasless = options.rawListingData.chainStatus === 'GASLESS';

	async function handlePurchase() {
		purchasing = true;

		const success = await salePurchase(options.rawListingData);

		if (success) {
			dispatch('set-frame', {
				component: Success,
				props: { message: 'Successfully purchased listing!' },
			});
			dispatch('force-expire');
		} else {
			dispatch('set-frame', {
				component: Error,
				props: { message: 'Failed to purchase listing!' },
			});
		}

		purchasing = false;
	}

	const hasEnoughTokens = derived(
		currentUserAddress,
		(address, set) => {
			hasEnoughBalance(
				options.rawListingData.paymentTokenAddress,
				address,
				options.saleData.formatPrice,
			).then(set);
		},
		null,
	);

	$: purchaseError =
		isFuture(dateToTimestamp(options.rawListingData.startTime)) &&
		"This listing isn't for sale yet.";

	$: saleData = options.rawListingData.listing as SaleDataModel;

	let priceString = null;

	$: {
		if (saleData.price.match(/^\d+$/)) {
			priceString = formatToken(
				saleData.price.toString(),
				options.rawListingData.paymentTokenAddress,
			);
		} else {
			priceString = null;
		}
	}

	onMount(async () => {
		if (!isGasless) {
			foundOnChain = await listingExistsOnChain(options.rawListingData.listingId);

			if (!foundOnChain) {
				notifyError('Listing was not found on chain.');
			}
		}
	});
</script>

<div class="flex flex-col text-white aspect-1 pb-px">
	<div class="text-gradient">Buy the NFT</div>
	<div class="mt-1">Click BUY NOW button to own this NFT</div>

	<div class="flex justify-start gap-40">
		<div class="">
			<div class="text-gradient mt-4">Price</div>
			<div class="flex gap-2 items-center">
				<EthV2 />
				<div class={(priceString || 'N/A').toString().length > 12 ? 'text-xl' : 'text-3xl'}>
					{priceString || 'N/A'}
				</div>
				<span>wETH</span>
			</div>
		</div>
		<div class="">
			<div class="text-gradient mt-4">Quantity</div>
			<div class="mt-1 pl-1 text-2xl">{options.rawListingData.nfts[0].amount}</div>
		</div>
	</div>

	<div class="flex-grow" />

	<div class="grid mt-12 place-items-center">
		{#if $appSigner}
			<div class="relative w-full">
				<PrimaryButton
					on:pointerenter={() => (hoveringPurchase = true)}
					on:pointerleave={() => (hoveringPurchase = false)}
					on:click={handlePurchase}
					disabled={purchasing ||
						!!purchaseError ||
						(!foundOnChain && !isGasless) ||
						isExpired ||
						($hasEnoughTokens === null && !isExpired)}
				>
					{#if purchasing || ($hasEnoughTokens === null && !isExpired)}
						<ButtonSpinner />
					{/if}
					Buy Now
				</PrimaryButton>

				{#if hoveringPurchase && purchaseError && (foundOnChain || isGasless)}
					<div class="absolute top-12">
						<InfoBubble>{purchaseError}</InfoBubble>
					</div>
				{/if}

				{#if hoveringPurchase && (!foundOnChain || isGasless)}
					<div class="absolute top-12">
						<InfoBubble>Sorry, this listing is no longer valid</InfoBubble>
					</div>
				{/if}
			</div>
		{:else}
			<PrimaryButton on:click={connectToWallet}>Connect Wallet</PrimaryButton>
		{/if}
	</div>
</div>
