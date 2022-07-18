<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import ListingPropertiesSlot from '$lib/components/primary-listing/ListingPropertiesSlot.svelte';
	import SaleProperties from '$lib/components/primary-listing/SaleProperties.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/v2/SecondaryButton/SecondaryButton.svelte';
	import { contractCancelListing,contractUpdateListing } from '$utils/contracts/listing';
	import { parseToken } from '$utils/misc/priceUtils';
	import { createToggle } from '$utils/misc/toggle';
	import { notifyError,notifySuccess } from '$utils/toast';
	import { noTryAsync } from 'no-try';
	import { createEventDispatcher } from 'svelte';
	import ListingTypeSwitch from './ListingTypeSwitch.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;

	// $: listingExpired = dayjs(options.listingData.startTime).add(options.listingData.duration, 'seconds').isBefore(dayjs());

	let isCancellingListing = createToggle();

	async function recreateListing() {
		options.staleResource.set({ reason: 'relisting' });
		dispatch('set-state', {
			name: 'recreate-listing',
			props: {
				options,
				selectedListing: 'sale',
				price: options.saleData.price,
				paymentTokenTicker: options.listingData.tokenSymbol,
				duration: options.duration,
				startingPrice: options.saleData.price ?? '0',
				reservePrice: '',
				quantity: '1'
			}
		});
	}

	async function cancelListing() {
		isCancellingListing.toggle();

		const [err, res] = await noTryAsync(() => contractCancelListing(options.listingData.onChainId));

		if (err) {
			console.error(err);
			notifyError('Failed to cancel listing.');
			dispatch('set-state', { name: 'error', props: { showProfileButton: false, showMarketplaceButton: false, successDescription: 'Listing cancelled successfully.' } });
		} else {
			options.staleResource.set({ reason: 'cancelled' });
			dispatch('set-state', {
				name: 'success',
				props: { showProfileButton: false, showMarketplaceButton: false, successDescription: 'Listing cancelled successfully.', showRelistButton: true, relistFunction: recreateListing }
			});
		}

		isCancellingListing.toggle();
	}

	const isUpdatingListing = createToggle();

	async function updateListing() {
		isUpdatingListing.toggle();

		const [err, res] = await noTryAsync(() =>
			contractUpdateListing(options.listingData.onChainId, {
				sale: { price },
				payTokenAddress: options.listingData.tokenAddress
			})
		);

		if (err) {
			console.error(err);
			notifyError('Failed to update listing.');
		} else {
			notifySuccess('Successfully updated listing.');
		}

		isUpdatingListing.toggle();
	}

	function _updateInputsFromOptions() {
		_saleProperties.setValues({
			startDateTs: options.listingData.startTime;
			
		})
	}

	// Listing properties
	let price: string;
	let durationSeconds: number;
	let startDateTs: number;

	let newPriceValid = false;

	$: try {
		const parsedNewPrice = parseToken(price, options.listingData.tokenAddress);
		const parsedOldPrice = parseToken(options.saleData.price, options.listingData.tokenAddress);

		newPriceValid = parsedNewPrice.lt(parsedOldPrice) && parsedNewPrice.gt(0);
	} catch {
		newPriceValid = false;
	}

	$: newPropertiesValid = newPriceValid;

	// Update listing button
	let updatebuttonContainer: HTMLElement;
	const isUpdateHovered = createToggle();

	let _saleProperties: SaleProperties;
</script>

<div class="flex flex-col h-full pb-8 overflow-y-scroll p-4 overscroll-contain">
	<!-- Listing Type -->
	<div class="font-semibold">Listing Type</div>
	<div class="mt-2"><ListingTypeSwitch selectedType={'sale'} disabled={true} /></div>

	<div class="mt-2">
		<ListingPropertiesSlot>
			<SaleProperties hideQuantity bind:price bind:durationSeconds bind:startDateTs bind:this={_saleProperties} />
		</ListingPropertiesSlot>
	</div>

	<div class="flex-grow" />

	<!-- Fees -->
	<div class="mt-4 ml-2 font-semibold">Fees</div>
	<div class="grid gap-2 mt-2 font-semibold ml-2" style:grid-template-columns="auto 6rem">
		<div>Creator Royalties:</div>
		<div class="flex justify-end space-x-3 items-center">
			<div class="">0.0%</div>
			<div class="w-5">
				<Info />
			</div>
		</div>

		<div class="gradient-text">Hinata Fees:</div>
		<div class="flex justify-end space-x-3 items-center">
			<div class="gradient-text">0%</div>
			<div class="w-5">
				<Info />
			</div>
		</div>
	</div>

	<div class="flex gap-2 mt-4">
		<SecondaryButton disabled={$isCancellingListing} on:click={cancelListing}>
			{#if $isCancellingListing}
				<ButtonSpinner secondary />
			{/if}
			Cancel Listing
		</SecondaryButton>

		<div bind:this={updatebuttonContainer} class="w-full" on:pointerenter={isUpdateHovered.toggle} on:pointerleave={isUpdateHovered.toggle}>
			<PrimaryButton on:click={updateListing} disabled={$isUpdatingListing || !newPropertiesValid}>
				{#if $isUpdatingListing}
					<ButtonSpinner />
				{/if}
				Update Listing
			</PrimaryButton>
		</div>
	</div>
</div>

{#if $isUpdateHovered && !newPriceValid}
	<AttachToElement to={updatebuttonContainer} bottom>
		<InfoBubble>New price must be lower than the current price.</InfoBubble>
	</AttachToElement>
{/if}
