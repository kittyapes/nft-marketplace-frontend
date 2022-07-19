<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import type { CardOptions } from '$lib/components/NftCard.svelte';
	import ListingPropertiesSlot from '$lib/components/primary-listing/ListingPropertiesSlot.svelte';
	import SaleProperties from '$lib/components/primary-listing/SaleProperties.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import InfoBubble from '$lib/components/v2/InfoBubble/InfoBubble.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
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

	const dispatch = createEventDispatcher();

	export let options: CardOptions;
	export let chainListing: ChainListing;

	let isCancellingListing = false;

	async function recreateListing() {
		options.staleResource.set({ reason: 'relisting' });
		dispatch('set-state', {
			name: 'recreate-listing',
			props: {
				options,
				selectedListing: 'sale',
				price: options.saleData.price,
				paymentTokenTicker: options.listingData.paymentTokenTicker,
				duration: options.listingData.duration,
				startingPrice: options.saleData.price ?? '0',
				reservePrice: '',
				quantity: '1'
			}
		});
	}

	async function cancelListing() {
		isCancellingListing = true;

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

		isCancellingListing = false;
	}

	let isUpdatingListing = false;

	async function updateListing() {
		isUpdatingListing = true;

		try {
			await contractUpdateListing(options.listingData.onChainId, chainListing.payToken, { duration: durationSeconds, price, quantity, startDateTs });
			notifySuccess('Successfully updated listing.');
		} catch (err) {
			notifyError('Failed to update listing.');
			console.error(err.message);
		}

		isUpdatingListing = false;
	}

	function _updateInputsFromData() {
		console.log({ chainListing });

		_saleProperties.setValues({
			startDateTs: chainListing.startTime,
			durationSeconds: chainListing.duration,
			price: chainListing.price,
			quantity: chainListing.quantity
		});
	}

	$: chainListing && _saleProperties && _updateInputsFromData();

	// Listing properties
	let price: string;
	let durationSeconds: number;
	let startDateTs: number;
	let quantity: number;

	// Update listing button
	let updatebuttonContainer: HTMLElement;
	const isUpdateHovered = createToggle();

	let _saleProperties: SaleProperties;

	// Validation
	let formErrors: string[] = [];

	$: disableStartDate = chainListing && !isFuture(chainListing.startTime);
</script>

<div class="flex flex-col h-full pb-8 overflow-y-scroll p-4 overscroll-contain">
	<div class="mt-2">
		<ListingPropertiesSlot>
			<SaleProperties
				bind:this={_saleProperties}
				bind:price
				bind:durationSeconds
				bind:startDateTs
				bind:quantity
				bind:formErrors
				maxQuantity={getTokenBalance(options.nfts[0].onChainId)}
				{disableStartDate}
				maxPrice={chainListing.price}
			/>
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
		<SecondaryButton disabled={isCancellingListing} on:click={cancelListing}>
			{#if isCancellingListing}
				<ButtonSpinner secondary />
			{/if}
			Cancel Listing
		</SecondaryButton>

		<div bind:this={updatebuttonContainer} class="w-full" on:pointerenter={isUpdateHovered.toggle} on:pointerleave={isUpdateHovered.toggle}>
			<PrimaryButton on:click={updateListing} disabled={isUpdatingListing || !!formErrors.length}>
				{#if isUpdatingListing}
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
