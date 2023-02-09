<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import V2Filter from './v2Filter.svelte';

	const dispatch = createEventDispatcher();

	export let options: any;
	export let icon: any;
	export let defaultOption = options?.[0];

	let handleFilter = (event: CustomEvent) => {
		dispatch('filter', event.detail);
	};
</script>

<div class="w-30">
	<V2Filter on:select={handleFilter} {options} selected={defaultOption}>
		<svelte:component this={icon} slot="icon" />
	</V2Filter>
</div>
