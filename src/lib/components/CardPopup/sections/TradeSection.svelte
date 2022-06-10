<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import BrowseState from './sale/BrowseState.svelte';
	import ErrorState from './sale/ErrorState.svelte';
	import SuccessState from './sale/SuccessState.svelte';

	export let options: CardPopupOptions;

	const states = [
		{ name: 'browse', component: BrowseState },
		{ name: 'success', component: SuccessState },
		{ name: 'error', component: ErrorState }
	];

	let selectedState = states[1];

	function handleSetState(e) {
		selectedState = states.find((s) => s.name === e.detail.name);
	}
</script>

{#if selectedState}
	<svelte:component this={selectedState.component} {options} on:set-state={handleSetState} on:close-popup />
{/if}
