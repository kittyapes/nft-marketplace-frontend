<script lang="ts">
	import CheckFilterDropdown from '$lib/components/v2/CheckFilterDropdown/CheckFilterDropdown.svelte';

	let options = [
		{ label: 'Option 1', checked: false },
		{ label: 'Option 2', checked: false },
		{ label: 'Option 3', checked: false },
		{ label: 'Option 4', checked: false },
	];

	let checkFilterDropdown: CheckFilterDropdown;
</script>

<CheckFilterDropdown bind:options bind:this={checkFilterDropdown} />

{JSON.stringify(options)}

<button on:click={() => checkFilterDropdown.selectAll()}>Select All</button>
<button on:click={() => checkFilterDropdown.clearAll()}>Clear All</button>
