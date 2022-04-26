<script lang="ts">
	import IconDropdown from '../IconDropdown.svelte';

	export let options;
	export let icon;
	export let entries = [];
	let defaultEntries = entries;

	let handleFilter = (event?: CustomEvent) => {};

	let handleClear = () => {
		entries = defaultEntries;
	};
</script>

<div class="w-44">
	<IconDropdown on:select={handleFilter} on:clear={handleClear} {options} selected={{ label: 'Filter' }}>
		<svelte:component this={icon} slot="icon" />
	</IconDropdown>
</div>
