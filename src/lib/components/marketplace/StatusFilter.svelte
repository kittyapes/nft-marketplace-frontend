<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import StatusFilterButton from './StatusFilterButton.svelte';

	const dispatch = createEventDispatcher();

	const listingTypes: { label: string; listingType: string; selected: boolean }[] = [
		{ label: 'Buy Now', listingType: 'sale', selected: false },
		{ label: 'Auction', listingType: 'auction', selected: false }
	];

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
		<StatusFilterButton label={type.label} selected={type.selected} on:click={() => (type.selected = !type.selected)} />
	{/each}
</div>
