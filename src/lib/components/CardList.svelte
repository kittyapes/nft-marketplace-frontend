<script lang="ts">
	import ChevronLeft from '$icons/chevron-left.svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import DiamondsLoader from './DiamondsLoader.svelte';

	const dispatch = createEventDispatcher();

	export let backFunction: Function;

	export let commonRenderComponent: any;
	export let firstRenderComponent: any;
	export let commonComponentProps: any[];

	export let title: string;
	export let showFirstComponent = true;
	export let loaded = false;
</script>

<div class="flex justify-center w-full h-full text-white" in:fade>
	<div class="w-4/5 py-20 ">
		<button class="flex items-center gap-2 clickable " on:click={() => backFunction()}>
			<ChevronLeft />
			<p class="text-sm font-semibold ">GO BACK</p>
		</button>
		<h1 class="mt-12 mb-4 text-5xl font-light">{title}</h1>

		<div class="py-12 cardGrid" in:slide|local>
			{#if showFirstComponent}
				<svelte:component this={firstRenderComponent} on:click={() => dispatch('first-component-click')} />
			{/if}
			{#each commonComponentProps as props}
				<svelte:component this={commonRenderComponent} {...props} on:click={() => dispatch('component-click', props)} />
			{/each}
			{#if !showFirstComponent && loaded && !commonComponentProps.length}
				<div class="p-20 text-lg font-semibold text-center opacity-60 min-w-max">Nothing to see here, move along.</div>
			{:else if !loaded}
				<DiamondsLoader />
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.cardGrid {
		@apply grid min-w-full min-h-full gap-4 place-items-center justify-center;
		grid-template-columns: repeat(auto-fill, 18rem);
	}
</style>
