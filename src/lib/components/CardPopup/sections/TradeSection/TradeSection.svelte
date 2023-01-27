<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { matches } from '$utils/misc';
	import { onMount } from 'svelte';
	import BrowseAuction from './frames/BrowseAuction.svelte';
	import BrowseSale from './frames/BrowseSale.svelte';
	import CreateListing from './frames/CreateListing.svelte';
	import EditSale from './frames/EditSale.svelte';
	import ManageAuction from './frames/ManageAuction.svelte';
	import ManageSale from './frames/ManageSale.svelte';
	import Success from './frames/Success.svelte';
	import Error from './frames/Error.svelte';

	export const showBackButton = false;

	export let options: CardOptions;
	export let listedNfts: number;
	export let enableBack = false;

	let frameStack: { component: ConstructorOfATypedSvelteComponent; props: any }[] = [];

	export function goBack() {
		frameStack.shift();
		frameStack = frameStack;
	}

	function handleSetFrame(ev: { detail: { component: ConstructorOfATypedSvelteComponent; props?: any } }) {
		frameStack.unshift({ component: ev.detail.component, props: ev.detail.props });
		frameStack = frameStack;
	}

	function setFrameWithoutProps(component: ConstructorOfATypedSvelteComponent) {
		handleSetFrame({ detail: { component: component } });
	}

	function setBaseFrame() {
		frameStack = [];

		if (!options.listingData) {
			setFrameWithoutProps(CreateListing);
			return;
		}

		if (options.resourceType === 'listing') {
			if (matches(options.rawListingData.seller, $currentUserAddress)) {
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

	onMount(setBaseFrame);

	// @ts-ignore
	$: enableBack = [Success, Error, EditSale].includes(frameStack[0]?.component);

	$: options, setBaseFrame();
</script>

<svelte:component
	this={frameStack[0].component}
	{...frameStack[0].props}
	{options}
	on:close-popup
	on:listing-created
	on:force-expire
	on:refresh-chain-data
	on:set-frame={handleSetFrame}
	{listedNfts}
/>
