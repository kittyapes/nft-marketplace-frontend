<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import type { ConfigurableListingProps } from '$interfaces/listing';
	import type { CardOptions } from '$interfaces/ui';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import ListingProperties from '$lib/components/primary-listing/ListingProperties.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { contractUpdateListing, getMarketFee } from '$utils/contracts/listing';
	import { dateToTimestamp } from '$utils/listings';
	import { isListingExpired } from '$utils/misc';
	import { formatToken } from '$utils/misc/priceUtils';
	import { totalColRoyalties } from '$utils/misc/royalties';
	import { isFuture } from '$utils/misc/time';
	import { createToggle } from '$utils/misc/toggle';
	import { getInterval } from '$utils/scheduler';
	import { notifyError } from '$utils/toast';
	import { onDestroy, onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import Success from './Success.svelte';
	import type { SaleDataModel } from '$interfaces/index';
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';
	import ManageSale from './ManageSale.svelte';
	import { browser } from '$app/environment';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;

	let allowEdit = true;

	const allowEditUnsubscribe = getInterval(1000).subscribe(() => {
		allowEdit = !isListingExpired(
			dateToTimestamp(options.rawListingData.startTime),
			options.rawListingData.duration,
		);
	});

	onDestroy(allowEditUnsubscribe);

	// Update listing button
	let updatebuttonContainer: HTMLElement;
	const isUpdateHovered = createToggle();

	let _listingProperties: ListingProperties;

	// Validation
	let formErrors: string[] = [];

	$: disableStartDate = !isFuture(dateToTimestamp(options.rawListingData.startTime));

	let updatingListing = false;

	async function updateListing() {
		updatingListing = true;

		try {
			await contractUpdateListing(
				options.listingData.onChainId,
				options.rawListingData.paymentTokenAddress,
				listingProps,
			);
			dispatch('set-frame', { component: Success });
			// options.staleResource.set({ reason: 'cancelled' });
		} catch (err) {
			console.error(err);
			notifyError('Failed to update listing.');
		}

		dispatch('refresh-chain-data');
		updatingListing = false;
	}

	let listingProps: Partial<ConfigurableListingProps> = {};

	$: saleData = options.rawListingData.listing as SaleDataModel;
	$: priceString = formatToken(saleData.price, options.rawListingData.paymentTokenAddress);

	onMount(() => {
		// Update input values from existing data
		_listingProperties.setValues({
			startDateTs: dateToTimestamp(options.rawListingData.startTime),
			durationSeconds: options.rawListingData.duration,
			price: priceString,
			quantity: options.rawListingData.nfts[0].amount,
		});
	});
</script>

<div class="aspect-1 overflow-hidden flex flex-col">
	<div class="flex flex-col overscroll-contain text-white overflow-y-auto pr-6" data-simplebar>
		<div class="mt-2">
			<!-- TODO maxQuantity needs to be checked on chain -->
			<ListingProperties
				listingType={options.listingData.listingType}
				disableQuantity
				{disableStartDate}
				maxPrice={priceString}
				minDuration={options.rawListingData.duration}
				disabled={updatingListing}
				disableQuantityCheck={true}
				bind:formErrors
				bind:props={listingProps}
				bind:this={_listingProperties}
			/>
		</div>

		<div class="flex-grow h-full" />

		<!-- Fees -->
		<div class="mt-4 ml-2 font-semibold">Fees</div>
		<div class="grid gap-2 mt-2 ml-2 font-semibold pr-1" style:grid-template-columns="auto 6rem">
			<div>Creator Royalties:</div>
			<div class="flex items-center justify-end space-x-3">
				<div class="">{totalColRoyalties(options)}%</div>
				<div class="w-5">
					<Info />
				</div>
			</div>

			<div>Hinata Fees:</div>
			<div class="flex items-center justify-end space-x-3">
				<div>
					{#if browser}
						{#await getMarketFee() then marketFee}
							{marketFee ?? 'N/A'} %
						{/await}
					{/if}
				</div>

				<div class="w-5">
					<Info />
				</div>
			</div>
		</div>
	</div>

	<div class="flex-grow" />

	<div class="flex gap-2 mt-4">
		<div class="w-full">
			<PrimaryButton
				disabled={updatingListing}
				on:click={() => dispatch('set-frame', { component: ManageSale })}
			>
				Go Back
			</PrimaryButton>
		</div>

		<div
			bind:this={updatebuttonContainer}
			class="w-full"
			on:pointerenter={isUpdateHovered.toggle}
			on:pointerleave={isUpdateHovered.toggle}
		>
			<PrimaryButton
				on:click={updateListing}
				disabled={!!formErrors.length || updatingListing || !allowEdit}
			>
				{#if updatingListing}
					<ButtonSpinner />
				{/if}
				Update Listing
			</PrimaryButton>
		</div>
	</div>
</div>

{#if $isUpdateHovered && formErrors.length}
	<AttachToElement to={updatebuttonContainer} bottom>
		<InfoBubble>{formErrors}</InfoBubble>
	</AttachToElement>
{/if}
