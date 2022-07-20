<script lang="ts">
	import InfoBox from '$lib/components/InfoBox.svelte';
	import type { CardOptions } from '$lib/components/NftCard.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import { parseToken } from '$utils/misc/priceUtils';
	import { getTokenBalance } from '$stores/user';
	import { contractCancelListing, contractUpdateListing, type ChainListing } from '$utils/contracts/listing';
	import { formatToken } from '$utils/misc/priceUtils';
	import { isFuture } from '$utils/misc/time';
	import { createToggle } from '$utils/misc/toggle';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { noTryAsync } from 'no-try';
	import { createEventDispatcher } from 'svelte';

	import { frame } from '../tradeSection';
	import EditSale from './EditSale.svelte';
	import Success from './Success.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;

	let cancellingListing = false;

	async function cancelListing() {
		cancellingListing = true;

		try {
			await contractCancelListing(options.listingData.onChainId);
			frame.set(Success);
			options.staleResource.set({ reason: 'cancelled' });
		} catch (err) {
			console.error(err);
			notifyError('Failed to cancel listing!');
		}

		cancellingListing = false;
	}
</script>

<div class="flex flex-col h-full pb-8 overflow-y-scroll p-4 overscroll-contain">
	<InfoBox>Offers on sale listings are coming soon!</InfoBox>

	<div class="flex-grow" />

	<div class="flex gap-2 mt-4">
		<SecondaryButton on:click={() => frame.set(EditSale)}>Edit Listing</SecondaryButton>

		<SecondaryButton disabled={cancellingListing} on:click={cancelListing}>
			{#if cancellingListing}
				<ButtonSpinner secondary />
			{/if}
			Cancel Listing
		</SecondaryButton>
	</div>
</div>
