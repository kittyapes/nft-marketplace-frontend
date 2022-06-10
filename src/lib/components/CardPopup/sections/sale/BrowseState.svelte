<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import CircularSpinner from '$lib/components/spinners/CircularSpinner.svelte';
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

	<div class="opacity-70 font-bold text-2xl text-center">Buy the NFT</div>
	<div class="opacity-50 text-center mt-4">Click buy now button to own this NFT</div>

	<div class="font-bold opacity-50 text-center mt-8">Price:</div>
	<div class="flex items-center justify-center mt-2">
		<img src={getIconUrl('eth')} alt="" />
		<div class="text-5xl font-bold">{options.saleData?.price || 'N/A'}</div>
		<div class="font-bold opacity-70 h-full grid place-items-end ml-2">ETH</div>
	</div>

	<div class="grid place-items-center mt-12">
		<button class="btn btn-gradient btn-rounded w-80 uppercase font-bold" on:click={handlePurchase} disabled={$purchasingState}>
			{#if $purchasingState}
				<div class="w-8 h-8 absolute top-0 bottom-0 my-auto -ml-6">
					<CircularSpinner />
				</div>
			{/if}
			Buy Now
		</button>
	</div>
</div>
