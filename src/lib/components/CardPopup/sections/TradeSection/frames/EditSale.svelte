<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import type { ConfigurableListingProps } from '$interfaces/listing';
	import type { CardOptions } from '$interfaces/ui';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import { refreshOnChainListing } from '$lib/components/CardPopup/cardPopup';
	import ListingProperties from '$lib/components/primary-listing/ListingProperties.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import { getTokenBalance } from '$stores/user';
	import { contractCancelListing, contractUpdateListing, type ChainListing } from '$utils/contracts/listing';
	import { totalColRoyalties } from '$utils/misc/royalties';
	import { isFuture } from '$utils/misc/time';
	import { createToggle } from '$utils/misc/toggle';
	import { notifyError } from '$utils/toast';
	import { frame } from '../tradeSection';
	import Success from './Success.svelte';

	export let options: CardOptions;
	export let chainListing: ChainListing;

	function _updateInputsFromData() {
		_listingProperties.setValues({
			startDateTs: chainListing.startTime,
			durationSeconds: chainListing.duration,
			price: chainListing.price,
			quantity: chainListing.quantity
		});
	}

	$: chainListing && _listingProperties && _updateInputsFromData();

	// Update listing button
	let updatebuttonContainer: HTMLElement;
	const isUpdateHovered = createToggle();

	let _listingProperties: ListingProperties;

	// Validation
	let formErrors: string[] = [];

	$: disableStartDate = chainListing && !isFuture(chainListing.startTime);

	let updatingListing = false;

	async function updateListing() {
		updatingListing = true;

		try {
			await contractUpdateListing(options.listingData.onChainId, chainListing.payToken, listingProps);
			frame.set(Success);
			options.staleResource.set({ reason: 'cancelled' });
		} catch (err) {
			console.error(err);
			notifyError('Failed to update listing.');
		}

		refreshOnChainListing();
		updatingListing = false;
	}

	let cancellingListing = false;

	async function cancelListing() {
		cancellingListing = true;

		try {
			await contractCancelListing(options.listingData.onChainId);
			options.staleResource.set({ reason: 'cancelled' });
		} catch (err) {
			console.error(err);
			notifyError('Failed to cancel listing!');
		}

		cancellingListing = false;
	}

	let listingProps: Partial<ConfigurableListingProps> = {};
</script>

<div class="flex flex-col h-full p-4 pb-8 overflow-y-scroll overscroll-contain">
	<div class="mt-2">
		<!-- TODO maxQuantity needs to be checked on chain -->
		<ListingProperties
			listingType={options.listingData.listingType}
			maxQuantity={getTokenBalance(options.nfts[0].onChainId)}
			disableQuantity
			{disableStartDate}
			maxPrice={chainListing.price}
			bind:formErrors
			bind:props={listingProps}
			bind:this={_listingProperties}
		/>
	</div>

	<div class="flex-grow" />

	<!-- Fees -->
	<div class="mt-4 ml-2 font-semibold">Fees</div>
	<div class="grid gap-2 mt-2 ml-2 font-semibold" style:grid-template-columns="auto 6rem">
		<div>Creator Royalties:</div>
		<div class="flex items-center justify-end space-x-3">
			<div class="">{totalColRoyalties(options)}%</div>
			<div class="w-5">
				<Info />
			</div>
		</div>

		<div class="gradient-text">Hinata Fees:</div>
		<div class="flex items-center justify-end space-x-3">
			<div class="gradient-text">0%</div>
			<div class="w-5">
				<Info />
			</div>
		</div>
	</div>

	<div class="flex gap-2 mt-4">
		<SecondaryButton disabled={updatingListing || cancellingListing} on:click={cancelListing}>
			{#if cancellingListing}
				<ButtonSpinner secondary />
			{/if}
			Cancel Listing
		</SecondaryButton>

		<div bind:this={updatebuttonContainer} class="w-full" on:pointerenter={isUpdateHovered.toggle} on:pointerleave={isUpdateHovered.toggle}>
			<PrimaryButton on:click={updateListing} disabled={!!formErrors.length || updatingListing || cancellingListing}>
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