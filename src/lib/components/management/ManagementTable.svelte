<script lang="ts">
	import type { TableCol } from 'src/interfaces/management/tableColumn';
	import { onMount } from 'svelte';

	export let tableData: TableCol[];
	let table: HTMLDivElement;

	onMount(() => {
		let gridColsClass = '';
		tableData.forEach((col) => (gridColsClass += col.gridSize + ' '));
		table.style.gridTemplateColumns = gridColsClass;
	});
</script>

<div class="w-full grid shadow-md rounded-xl" bind:this={table}>
	{#each tableData as column}
		<div>
			<svelte:component this={column.titleRenderComponent} props={column.titleRenderComponentProps || null} />
			<div class="">
				{#each column.renderComponentProps as props}
					<svelte:component this={column.renderComponent} props={props || null} />
				{/each}
			</div>
		</div>
	{/each}
</div>
