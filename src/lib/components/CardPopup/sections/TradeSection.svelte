<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import BrowseState from './sale/BrowseState.svelte';
	import CreateListingState from './sale/CreateListingState.svelte';
	import ErrorState from './sale/ErrorState.svelte';
	import SuccessState from './sale/SuccessState.svelte';

	export let options: CardPopupOptions;
	export let showBackButton = false;

	export function goBack() {
		selectedState = states[0];
	}

	const states = [
		{ name: 'browse', component: BrowseState },
		{ name: 'success', component: SuccessState },
		{ name: 'error', component: ErrorState },
		{ name: 'create-listing', component: CreateListingState }
	];

	let selectedState = states[0];

	$: if (options.resourceType === 'listing') {
		selectedState = states.find((s) => s.name === 'browse');
	} else {
		selectedState = states.find((s) => s.name === 'create-listing');
	}

	function handleSetState(e) {
		selectedState = states.find((s) => s.name === e.detail.name);
	}

	$: showBackButton = ['success', 'error'].includes(selectedState.name);
</script>

{#if selectedState}
	<svelte:component this={selectedState.component} {options} on:set-state={handleSetState} on:close-popup />
{/if}
