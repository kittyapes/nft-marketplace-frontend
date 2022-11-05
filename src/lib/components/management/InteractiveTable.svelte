<script lang="ts">
	import type { TableCol } from 'src/interfaces/management/tableColumn';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let tableData: TableCol[];
	export let rows: number = 0;
	export let v2 = false;
	export let tableFooterElement: {
		element?: any;
		props?: any;
		fullRow?: boolean;
	} = {};

	let table: HTMLDivElement;

	onMount(() => {
		let gridColsClass = '';
		tableData.forEach((col) => (gridColsClass += col.gridSize + ' '));
		table.style.gridTemplateColumns = gridColsClass;
	});
</script>

{#if !v2}
	<div class="w-full grid shadow-md rounded-xl relative min-w-min {$$props.class}" bind:this={table}>
		{#each tableData as column}
			<div in:fade>
				<svelte:component this={column.titleRenderComponent} on:event props={column.titleRenderComponentProps || null} />
				<div class="">
					{#if column.renderComponentProps}
						{#each column.renderComponentProps as props}
							<svelte:component this={column.renderComponent} on:event {props} />
						{/each}
					{:else if rows}
						{#each Array(rows) as _}
							<svelte:component this={column.renderComponent} on:event props={null} />
						{/each}
					{/if}
				</div>
			</div>
		{/each}
		{#if tableFooterElement?.element}
			<svelte:component this={tableFooterElement.element} on:event props={tableFooterElement.props || null} />
		{/if}
	</div>
{:else}
	<div class="w-full grid shadow-md relative min-w-min border border-b-0 border-white {$$props.class}" bind:this={table}>
		{#each tableData as column}
			<div in:fade>
				<svelte:component this={column.titleRenderComponent} on:event props={column.titleRenderComponentProps || null} />
				<div class="">
					{#if column.renderComponentProps}
						{#each column.renderComponentProps as props}
							<svelte:component this={column.renderComponent} on:event {props} />
						{/each}
					{:else if rows}
						{#each Array(rows) as _}
							<svelte:component this={column.renderComponent} on:event props={null} />
						{/each}
					{/if}
				</div>
			</div>
		{/each}
		{#if tableFooterElement?.element}
			<svelte:component this={tableFooterElement.element} on:event props={tableFooterElement.props || null} />
		{/if}
	</div>
{/if}
