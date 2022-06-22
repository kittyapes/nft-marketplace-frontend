<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import { currentUserAddress } from '$stores/wallet';
	import BrowseState from './sale/BrowseState.svelte';
	import CreateListingState from './sale/CreateListingState.svelte';
	import ErrorState from './sale/ErrorState.svelte';
	import ManageAuctionState from './sale/ManageAuctionState.svelte';
	import SuccessState from './sale/SuccessState.svelte';

	export let options: CardPopupOptions;
	export let showBackButton = false;

	export function goBack() {
		selectedState = states[0];
	}

	const states: { name: string; component: any }[] = [
		{ name: 'browse', component: BrowseState },
		{ name: 'create-listing', component: CreateListingState },
		{ name: 'manage-auction', component: ManageAuctionState },
		{ name: 'success', component: SuccessState },
		{ name: 'error', component: ErrorState }
	];

	let selectedState: typeof states[0];

	$: options && updateState();

	function updateState() {
		let stateName: string;

		if (options.resourceType === 'listing') {
			if (options.listingData.sellerAddress === $currentUserAddress) {
				if (options.listingData.listingType === 'auction') stateName = 'manage-auction';
				if (options.listingData.listingType === 'sale') stateName = 'browse';
			} else {
				stateName = 'browse';
			}
		} else if (options.resourceType === 'nft') {
			stateName = 'create-listing';
		}

		selectedState = states.find((s) => s.name === stateName);
	}

	function handleSetState(e) {
		const stateName = e.detail.name;

		selectedState = states.find((s) => s.name === stateName);
		stateProps[stateName] = e.detail.props;
	}

	// We use a object with props for each state separately to avoid deleting
	// props when switching states.
	const stateProps = {};

	$: showBackButton = selectedState && ['success', 'error'].includes(selectedState.name);
</script>

{#if selectedState}
	<svelte:component this={selectedState.component} {options} {...stateProps[selectedState.name]} on:set-state={handleSetState} on:close-popup />
{:else}
	Jakub is dumb
{/if}
