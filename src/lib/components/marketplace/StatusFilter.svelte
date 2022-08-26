<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import StatusFilterButton from './StatusFilterButton.svelte';

	const dispatch = createEventDispatcher();

	export let state: string = '';

	let listingTypes: { label: string; listingType: string; selected: boolean }[] = [
		{ label: 'Buy Now', listingType: 'sale', selected: false },
		{ label: 'Auction', listingType: 'auction', selected: false }
	];

	listingTypes.forEach((t) => {
		if (state && t.listingType === state) {
			t.selected = true;
		}
	});

	function selectFilter(type: { label: string; listingType: string; selected: boolean }) {
		// Unselect selected filter if one is selected
		// This has to be re-thought when adding a third listing type

		const selected = listingTypes.find((t) => t.selected);

		if (selected && selected !== type) {
			selected.selected = false;
		}

		type.selected = !type.selected;
		listingTypes = listingTypes;
	}

	$: {
		const selectedTypes = listingTypes
			.filter((i) => i.selected)
			.map((i) => i.listingType)
			.join('+');

		if (selectedTypes) {
			$page.url.searchParams.set('types', selectedTypes);
		} else {
			$page.url.searchParams.delete('types');
		}

		goto('?' + $page.url.searchParams);
		dispatch('request-refresh');
	}

	onDestroy(() => {
		$page.url.searchParams.delete('types');
		goto('?' + $page.url.searchParams);
		dispatch('request-refresh');
	});
</script>

<div class="flex flex-wrap gap-2">
	{#each listingTypes as type}
		<StatusFilterButton label={type.label} selected={type.selected} on:click={() => selectFilter(type)} />
	{/each}
</div>
