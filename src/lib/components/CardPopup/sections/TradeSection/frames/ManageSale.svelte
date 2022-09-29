<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import { contractCancelListing, type ChainListing } from '$utils/contracts/listing';
	import { isListingExpired } from '$utils/misc';
	import { getInterval } from '$utils/scheduler';
	import { notifyError } from '$utils/toast';
	import { createEventDispatcher } from 'svelte';

	import { frame } from '../tradeSection';
	import EditSale from './EditSale.svelte';
	import Success from './Success.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;
	export let chainListing: ChainListing;

	let showEditButton = true;

	getInterval(1000).subscribe(() => {
		showEditButton = !isListingExpired(chainListing.startTime, chainListing.duration);
	});

	let cancellingListing = false;

	async function cancelListing() {
		if (!chainListing?.isValidOnChainListing) {
			notifyError('Failed to Cancel Listing: Listing is no longer valid (not on chain)');
			return;
		}

		cancellingListing = true;

		try {
			await contractCancelListing(options.listingData.onChainId);
			frame.set(Success);
			options.staleResource.set({ reason: 'cancelled' });
			dispatch('force-expire');
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
		{#if showEditButton}
			<SecondaryButton on:click={() => frame.set(EditSale)}>Edit Listing</SecondaryButton>
		{/if}

		<SecondaryButton disabled={cancellingListing} on:click={cancelListing}>
			{#if cancellingListing}
				<ButtonSpinner secondary />
			{/if}
			Cancel Listing
		</SecondaryButton>
	</div>
</div>
