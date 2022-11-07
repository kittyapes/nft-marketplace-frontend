<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import type { ChainListing } from '$utils/contracts/listing';
	import { matches } from '$utils/misc';
	import { isZeroAddress } from '$utils/misc/address';
	import BrowseAuction from './frames/BrowseAuction.svelte';
	import BrowseSale from './frames/BrowseSale.svelte';
	import CreateListing from './frames/CreateListing.svelte';
	import Error from './frames/Error.svelte';
	import ManageAuction from './frames/ManageAuction.svelte';
	import ManageSale from './frames/ManageSale.svelte';
	import NotTradable from './frames/NotTradable.svelte';
	import Success from './frames/Success.svelte';

	export let options: CardOptions;
	export let chainListing: ChainListing;
	export let showBackButton = false;

	let frameComponent: ConstructorOfATypedSvelteComponent;
	let frameProps: any;

	function handleSetFrame(ev: { detail: { component: ConstructorOfATypedSvelteComponent; props?: any } }) {
		frameComponent = ev.detail.component;
		frameProps = ev.detail.props || {};
	}

	function setFrameWithoutProps(component: ConstructorOfATypedSvelteComponent) {
		handleSetFrame({ detail: { component: component } });
	}

	export function goBack() {
		if (!options.listingData) {
			setFrameWithoutProps(CreateListing);
			return;
		}

		options.listingData.listingType === 'sale' ? setFrameWithoutProps(BrowseSale) : setFrameWithoutProps(BrowseAuction);
	}

	$: (options || chainListing) && updateState();

	function updateState() {
		if (options.resourceType === 'listing') {
			if (!chainListing) {
				setFrameWithoutProps(DiamondsLoader);
				return;
			}

			if (isZeroAddress(chainListing.seller)) {
				setFrameWithoutProps(NotTradable);
				return;
			}

			if (matches(chainListing.seller, $currentUserAddress)) {
				if (options.listingData.listingType === 'auction') setFrameWithoutProps(ManageAuction);
				if (options.listingData.listingType === 'sale') setFrameWithoutProps(ManageSale);
			} else {
				if (options.listingData.listingType === 'auction') setFrameWithoutProps(BrowseAuction);
				if (options.listingData.listingType === 'sale') setFrameWithoutProps(BrowseSale);
			}
		} else if (options.resourceType === 'nft') {
			setFrameWithoutProps(CreateListing);
		}
	}

	$: showBackButton = frameComponent === Success || frameComponent === Error;

	// Initialize state
	goBack();
</script>

<svelte:component this={frameComponent} {...frameProps} {options} {chainListing} on:close-popup on:listing-created on:force-expire on:refresh-chain-data on:set-frame={handleSetFrame} />
