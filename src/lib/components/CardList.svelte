<script lang="ts">
	import LongLeftArrow from '$icons/long-left-arrow.svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
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

<div class="w-full h-full flex justify-center " in:fade>
	<div class="w-4/5 py-20 ">
		<button class="clickable flex items-center gap-2 " on:click={() => backFunction()}>
			<LongLeftArrow />
			<p class="text-color-black font-semibold text-sm">GO BACK</p>
		</button>
		<h1 class="italic text-5xl font-light mt-12 mb-4">{title}</h1>
		<div class="border-b border-black border-opacity-30" />

		<div class="py-12 cardGrid" in:fade>
			{#if showFirstComponent}
				<svelte:component this={firstRenderComponent} on:click={() => dispatch('first-component-click')} />
			{/if}
			{#if commonComponentProps.length}
				{#each commonComponentProps as props}
					<svelte:component this={commonRenderComponent} {...props} on:click={() => dispatch('component-click', props)} />
				{/each}
			{:else if !showFirstComponent && loaded && !commonComponentProps.length}
				<div class="p-20 font-semibold text-lg opacity-60 text-center min-w-max">Nothing to see here, move along.</div>
			{:else if !loaded}
				<DiamondsLoader />
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.cardGrid {
		@apply grid min-w-full gap-4 place-items-center justify-center;
		grid-template-columns: repeat(auto-fit, 18rem);
	}
</style>
