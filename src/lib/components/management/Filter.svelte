<script lang="ts">
	import IconDropdown from '../IconDropdown.svelte';
	import { createEventDispatcher } from 'svelte';
  	import V2Filter from './v2Filter.svelte';

	const dispatch = createEventDispatcher();

	export let options: any;
	export let icon: any;
	export let defaultOption = options?.[0];
	export let v2 = false;

	let handleFilter = (event: CustomEvent) => {
		dispatch('filter', event.detail);
	};
</script>

<div class="w-30">
	{#if !v2}
		<IconDropdown on:select={handleFilter} {options} selected={defaultOption}>
			<svelte:component this={icon} slot="icon" />
		</IconDropdown>
	{:else}
		<V2Filter on:select={handleFilter} {options} selected={defaultOption}>
			<svelte:component this={icon} slot="icon" />
		</V2Filter>
	{/if}
</div>
