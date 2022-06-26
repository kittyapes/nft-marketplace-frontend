<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import OfferAndAsk from '$lib/components/CardPopup/lib/OfferAndAsk.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import TokenDropdown from '$lib/components/TokenDropdown.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { contractCancelListing, listingDurationOptions, listingTokens } from '$utils/contracts/listing';
	import { notifyError } from '$utils/toast';
	import { noTryAsync } from 'no-try';
	import { createEventDispatcher } from 'svelte';
	import ListingTypeSwitch from './ListingTypeSwitch.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;

	// $: listingExpired = dayjs(options.listingData.startTime).add(options.listingData.duration, 'seconds').isBefore(dayjs());

	let isCancellingListing = false;

	async function cancelListing() {
		isCancellingListing = true;

		const [err, res] = await noTryAsync(() => contractCancelListing(options.listingData.onChainId));

		if (err) {
			console.error(err);
			notifyError('Failed to cancel listing.');
			dispatch('set-state', { name: 'error', props: { showProfileButton: false, showMarketplaceButton: false, successDescription: 'Listing cancelled successfully.' } });
		} else {
			options.staleResource.set({ reason: 'cancelled' });
			dispatch('set-state', { name: 'success', props: { showProfileButton: false, showMarketplaceButton: false, successDescription: 'Listing cancelled successfully.' } });
		}

		isCancellingListing = false;
	}

	let price = options.saleData.price;
	let duration = listingDurationOptions.find((l) => l.value === options.listingData.duration);
</script>

<div class="flex flex-col h-full pb-8">
	<!-- Listing Type -->
	<div class="mt-4 font-semibold">Listing Type</div>
	<div class="mt-2"><ListingTypeSwitch selectedType={'sale'} disabled={true} /></div>

	<!-- Price -->
	<div class="mt-4 font-semibold">Price</div>
	<div class="mt-2">
		<TokenDropdown
			disabled
			dropdownBg="white"
			dropdownColor="black"
			dropdownButtonBg="white"
			dropdownButtonColor="black"
			showLabel
			showArrow={false}
			buttonDisabled
			bind:value={price}
			tokens={listingTokens}
		/>
	</div>

	<!-- Duration -->
	<div class="mt-4 mb-2 font-semibold">Duration</div>
	<Dropdown options={listingDurationOptions} bind:selected={duration} borderOpacity={1} disabled />

	<div class="flex-grow" />

	<!-- Fees -->
	<div class="mt-4 font-semibold">Fees</div>
	<div class="grid gap-2 mt-2 mb-4 font-semibold" style:grid-template-columns="auto 6rem">
		<div>Creator Royalties:</div>
		<div class="flex justify-end space-x-3">
			<div class="">0.0%</div>
			<div class="w-6">
				<Info />
			</div>
		</div>

		<div class="gradient-text">Hinata Fees:</div>
		<div class="flex justify-end space-x-3">
			<div class="gradient-text">0%</div>
			<div class="w-6">
				<Info />
			</div>
		</div>
	</div>

	<OfferAndAsk offer="N/A" ask="N/A" />

	<PrimaryButton class="mt-4" disabled={isCancellingListing} on:click={cancelListing}>
		{#if isCancellingListing}
			<ButtonSpinner />
		{/if}
		Cancel Listing
	</PrimaryButton>
</div>
