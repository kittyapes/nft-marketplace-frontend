<script lang="ts">
	import type { TableCol } from 'src/interfaces/management/tableColumn';
	import { onMount } from 'svelte';
	import Loader from '../Loader.svelte';
	import { fade } from 'svelte/transition';

	export let tableData: TableCol[];
	let table: HTMLDivElement;
	let loaded = false;

	onMount(() => {
		let gridColsClass = '';
		tableData.forEach((col) => (gridColsClass += col.gridSize + ' '));
		table.style.gridTemplateColumns = gridColsClass;
		loaded = true;
	});
</script>

<div class="w-full grid shadow-md rounded-xl relative" bind:this={table}>
	{#if loaded}
		{#each tableData as column}
			<div in:fade>
				<svelte:component this={column.titleRenderComponent} props={column.titleRenderComponentProps || null} />
				<div class="">
					{#each column.renderComponentProps as props}
						<svelte:component this={column.renderComponent} props={props || null} />
					{/each}
				</div>
			</div>
		{/each}
	{:else}
		<Loader />
	{/if}
</div>
