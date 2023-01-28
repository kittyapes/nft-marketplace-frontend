<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { contractCancelListing } from '$utils/contracts/listing';
	import { isListingExpired } from '$utils/misc';
	import { getInterval } from '$utils/scheduler';
	import { notifyError } from '$utils/toast';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import EditSale from './EditSale.svelte';
	import Success from './Success.svelte';
	import { userHasRole } from '$utils/auth/userRoles';
	import { dateToTimestamp, listingExistsOnChain } from '$utils/listings';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;

	let listingExpired: boolean;

	$: allowEdit = !$userHasRole('inactivated_user') && !listingExpired;

	const allowEditUnsubscribe = getInterval(1000).subscribe(() => {
		listingExpired = isListingExpired(dateToTimestamp(options.rawListingData.startTime), options.rawListingData.duration);
	});

	onDestroy(allowEditUnsubscribe);

	let cancellingListing = false;

	async function cancelListing() {
		if (!listingExistsOnChain(options.rawListingData.listingId)) {
			notifyError('Failed to Cancel Listing: Listing is no longer valid (not on chain)');
			return;
		}

		cancellingListing = true;

		try {
			await contractCancelListing(options.listingData.onChainId);
			dispatch('set-frame', { component: Success });
			options.staleResource.set({ reason: 'cancelled' });
			dispatch('force-expire');
		} catch (err) {
			console.error(err);
			notifyError('Failed to cancel listing!');
		}

		cancellingListing = false;
	}
</script>

<div class="flex flex-col aspect-1 text-white">
	<InfoBox>Offers on sale listings are coming soon!</InfoBox>

	<div class="flex-grow" />

	<div class="grid gap-4 mt-4" class:grid-cols-2={allowEdit}>
		{#if allowEdit}
			<PrimaryButton on:click={() => dispatch('set-frame', { component: EditSale })}>Edit Listing</PrimaryButton>
		{/if}

		<PrimaryButton disabled={cancellingListing} on:click={cancelListing}>
			{#if cancellingListing}
				<ButtonSpinner secondary />
			{/if}
			Cancel Listing
		</PrimaryButton>
	</div>
</div>
