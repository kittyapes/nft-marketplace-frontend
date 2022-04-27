<script lang="ts">
	import type { TableCol } from 'src/interfaces/management/tableColumn';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let tableData: TableCol[];
	export let rows: number;
	let table: HTMLDivElement;

	onMount(() => {
		let gridColsClass = '';
		tableData.forEach((col) => (gridColsClass += col.gridSize + ' '));
		table.style.gridTemplateColumns = gridColsClass;
	});
</script>

<div class="w-full grid shadow-md rounded-xl relative min-w-min" bind:this={table}>
	{#each tableData as column}
		<div in:fade>
			<svelte:component this={column.titleRenderComponent} on:event props={column.titleRenderComponentProps || null} />
			<div class="">
				{#if column.renderComponentProps}
					{#each column.renderComponentProps as props}
						<svelte:component this={column.renderComponent} {props} />
					{/each}
				{:else}
					{#each Array(rows) as _}
						<svelte:component this={column.renderComponent} props={null} />
					{/each}
				{/if}
			</div>
		</div>
	{/each}
</div>
