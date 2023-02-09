<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let filterOptions: { label: string; queryParam: '' | 'multiple' | 'single' }[] = [
		{ label: 'All', queryParam: '' },
		{ label: 'Multiple Editions', queryParam: 'multiple' },
		{ label: 'Single Editions', queryParam: 'single' },
	];
	let typeFilter = $page?.url?.searchParams.get('type') || filterOptions[0]?.queryParam;
	$: {
		if (typeFilter !== '') $page?.url?.searchParams?.set('type', typeFilter);
		else $page?.url?.searchParams?.delete('type');
		goto(`?${$page?.url?.searchParams}`);
		dispatch('request-refresh');
	}
</script>

<div class="flex flex-row flex-wrap items-center gap-x-5 2xl:gap-x-6 gap-y-4 2xl:gap-y-5">
	{#each filterOptions as option}
		<button
			type="button"
			on:click={() => (typeFilter = option?.queryParam)}
			class="px-4 2xl:px-6 py-2 2xl:py-2.5 font-medium text-sm 2xl:text-lg leading-6 2xl:leading-7 border-gradient hover:bg-main-gradient transition-btn {option?.queryParam === typeFilter
				? 'bg-main-gradient'
				: 'bg-gradient-a'}"
		>
			{option.label}
		</button>
	{/each}
</div>
