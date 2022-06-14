<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import CircularSpinner from '$lib/components/spinners/CircularSpinner.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { salePurchase } from '$utils/flows/salePurchase';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { ethers } from 'ethers';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;

	const purchasingState = writable(null);

	async function handlePurchase() {
		purchasingState.set('waiting-contract');

		const price = ethers.utils.parseEther(options.saleData.price.toString());
		const success = await salePurchase(options.saleData.listingId, price);

		success ? dispatch('set-state', { name: 'success' }) : dispatch('set-state', { name: 'error' });

		purchasingState.set(null);
	}
</script>

<div class="flex flex-col justify-center h-[90%]">
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
		{#if options.listingData.sellerAddress === $currentUserAddress}
			<InfoBox>You cannot purchase this listing, because you are the creator.</InfoBox>
		{:else}
			<button class="font-bold uppercase btn btn-gradient btn-rounded w-80" on:click={handlePurchase} disabled={$purchasingState}>
				{#if $purchasingState}
					<div class="absolute top-0 bottom-0 w-8 h-8 my-auto -ml-6">
						<CircularSpinner />
					</div>
				{/if}
				Buy Now
			</button>
		{/if}
	</div>
</div>
