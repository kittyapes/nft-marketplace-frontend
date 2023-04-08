<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { isListingExpired } from '$utils/misc';
	import { getInterval } from '$utils/scheduler';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import EditSale from './EditSale.svelte';
	import Success from './Success.svelte';
	import { userHasRole } from '$utils/auth/userRoles';
	import { dateToTimestamp } from '$utils/listings';
	import { cancelListingFlow } from '$utils/flows/cancelListingFlow';
	import EthV2 from '$icons/eth-v2.svelte';
	import OffersLoader from '$lib/components/functional/OffersLoader/OffersLoader.svelte';
	import OfferList from '$lib/components/v2/OfferList/OfferList.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;

	let listingExpired: boolean;

	$: allowEdit =
		!$userHasRole('inactivated_user') &&
		!listingExpired &&
		options.rawListingData.chainStatus !== 'GASLESS';

	const allowEditUnsubscribe = getInterval(1000).subscribe(() => {
		listingExpired = isListingExpired(
			dateToTimestamp(options.rawListingData.startTime),
			options.rawListingData.duration,
		);
	});

	onDestroy(allowEditUnsubscribe);

	let cancellingListing = false;

	async function cancelListing() {
		cancellingListing = true;

		const cancelSuccess = await cancelListingFlow(options.rawListingData);

		if (cancelSuccess) {
			dispatch('set-frame', { component: Success });
			options.staleResource.set({ reason: 'cancelled' });
			dispatch('force-expire');
		}

		cancellingListing = false;
	}
</script>

<div class="flex flex-col aspect-1 text-white overflow-hidden">
	<div class="text-white text-lg font-medium mb-2 flex-shrink-0">Offers</div>

	<div class="flex-grow overflow-hidden">
		<OffersLoader let:isLoading let:isError let:isEndReached let:offers let:onEndReached>
			<OfferList
				userIsOwner={true}
				currentUserOffer={null}
				data={offers}
				{isLoading}
				endReached={isEndReached}
				errLoading={isError}
				on:end-of-scroll={onEndReached}
			/>
		</OffersLoader>
	</div>

	<div class="text-white flex mt-6 items-center font-medium">
		<div class="flex-grow">Price</div>
		<div class="flex items-center gap-2">{123} <EthV2 /></div>
	</div>

	<div class="grid gap-2 mt-4" class:grid-cols-2={allowEdit}>
		{#if allowEdit}
			<PrimaryButton on:click={() => dispatch('set-frame', { component: EditSale })}>
				Edit Listing
			</PrimaryButton>
		{/if}

		<PrimaryButton disabled={cancellingListing} on:click={cancelListing}>
			{#if cancellingListing}
				<ButtonSpinner secondary />
			{/if}
			Cancel Listing
		</PrimaryButton>
	</div>
</div>
