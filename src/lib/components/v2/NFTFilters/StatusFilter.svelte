<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let filterOptions: { label: string; queryParam: '' | 'auction' | 'sale' }[] = [
		{ label: 'Buy Now', queryParam: 'sale' },
		{ label: 'Auction', queryParam: 'auction' },
	];

	let statusFilter = $page?.url?.searchParams.get('types') || '';

	$: {
		if (statusFilter !== '') $page?.url?.searchParams?.set('types', statusFilter);
		else $page?.url?.searchParams?.delete('types');

		goto(`?${$page?.url?.searchParams}`);

		dispatch('request-refresh');
	}
</script>

<div class="flex gap-2">
	{#each filterOptions as option, index}
		<button
			type="button"
			on:click={() => {
				if (option?.queryParam === statusFilter) {
					statusFilter = '';
				} else {
					statusFilter = option?.queryParam;
				}
			}}
			class="py-2 2xl:py-2.5 font-medium leading-6 2xl:leading-7 border-gradient hover:bg-main-gradient transition-btn flex-grow {option?.queryParam ===
			statusFilter
				? 'bg-main-gradient'
				: 'bg-gradient-a'}"
			class:col-span-2={index === 0}
		>
			{option.label}
		</button>
	{/each}
</div>
