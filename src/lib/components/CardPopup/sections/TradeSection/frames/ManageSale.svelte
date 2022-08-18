<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import { contractCancelListing, type ChainListing } from '$utils/contracts/listing';
	import { notifyError } from '$utils/toast';

	import { frame } from '../tradeSection';
	import EditSale from './EditSale.svelte';
	import Success from './Success.svelte';

	export let options: CardOptions;
	export let chainListing: ChainListing;

	let cancellingListing = false;

	async function cancelListing() {
		cancellingListing = true;

		if (!chainListing?.isValidOnChainListing) {
			notifyError('Failed to Cancel Listing: Listing is no longer valid (not on chain)');
			return;
		}

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

<div class="flex flex-col h-full p-4 pb-8 overflow-y-auto overscroll-contain blue-scrollbar">
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
