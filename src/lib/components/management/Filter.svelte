<script lang="ts">
	import IconDropdown from '../IconDropdown.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options: any;
	export let icon: any;
	export let defaultOption = options?.[0];

	let handleFilter = (event: CustomEvent) => {
		dispatch('filter', event.detail);
	};
</script>

<div class="w-44">
	<IconDropdown on:select={handleFilter} {options} selected={defaultOption}>
		<svelte:component this={icon} slot="icon" />
	</IconDropdown>
</div>
