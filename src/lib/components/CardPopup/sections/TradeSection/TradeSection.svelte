<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';

	import { currentUserAddress } from '$stores/wallet';
	import type { ChainListing } from '$utils/contracts/listing';
	import { matches } from '$utils/misc';
	import { unpackedComponentStore } from '$utils/ui';
	import BrowseAuction from './frames/BrowseAuction.svelte';
	import BrowseSale from './frames/BrowseSale.svelte';
	import CreateListing from './frames/CreateListing.svelte';
	import Error from './frames/Error.svelte';
	import ManageAuction from './frames/ManageAuction.svelte';
	import ManageSale from './frames/ManageSale.svelte';
	import Success from './frames/Success.svelte';
	import { frame } from './tradeSection';

	export let options: CardOptions;
	export let chainListing: ChainListing;
	export let showBackButton = false;

	export function goBack() {
		if (!options.listingData) {
			frame.set(CreateListing);
			return;
		}

		options.listingData.listingType === 'sale' ? frame.set(BrowseSale) : frame.set(BrowseAuction);
	}

	$: (options || chainListing) && updateState();

	function updateState() {
		if (options.resourceType === 'listing') {
			if (!chainListing) frame.set(DiamondsLoader);
			else {
				if (matches(chainListing.seller, $currentUserAddress)) {
					if (options.listingData.listingType === 'auction') frame.set(ManageAuction);
					if (options.listingData.listingType === 'sale') frame.set(ManageSale);
				} else {
					if (options.listingData.listingType === 'auction') frame.set(BrowseAuction);
					if (options.listingData.listingType === 'sale') frame.set(BrowseSale);
				}
			}
		} else if (options.resourceType === 'nft') {
			frame.set(CreateListing);
		}
	}

	$: showBackButton = $frame === Success || $frame === Error;

	// Initialize state
	goBack();

	const { component, props } = unpackedComponentStore(frame);
</script>

<svelte:component this={$component} {...$props} {options} {chainListing} on:close-popup on:listing-created />
