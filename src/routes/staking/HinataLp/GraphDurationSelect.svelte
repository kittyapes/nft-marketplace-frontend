<script lang="ts">
	export const options = [
		{ id: 'day', label: '1D' },
		{ id: 'week', label: '1W' },
		{ id: 'month', label: '1M' },
		{ id: 'year', label: '1Y' },
		{ id: 'all', label: 'ALL' },
	];

	export let selected = options[1];
</script>

<div class="flex space-x-2">
	{#each options as option}
		<button class:text-gradient={option.id === selected.id} on:click={() => (selected = option)}>
			{option.label}
		</button>
	{/each}
</div>
