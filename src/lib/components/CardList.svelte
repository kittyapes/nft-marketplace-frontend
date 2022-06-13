<script lang="ts">
	import LongLeftArrow from '$icons/long-left-arrow.svelte';
	import { createEventDispatcher } from 'svelte';
	import LoadedContent from './LoadedContent.svelte';
	import { fade } from 'svelte/transition';
	import DiamondsLoader from './DiamondsLoader.svelte';

	const dispatch = createEventDispatcher();

	export let backFunction: Function;

	export let commonRenderComponent: any;
	export let firstRenderComponent: any;
	export let commonComponentProps: any[];

	export let title: string;
</script>

<div class="w-full h-full flex justify-center" in:fade>
	<div class="w-4/5 py-20 ">
		<button class="clickable flex items-center gap-2 " on:click={() => backFunction()}>
			<LongLeftArrow />
			<p class="text-color-black font-semibold text-sm">GO BACK</p>
		</button>
		<h1 class="italic text-5xl font-light mt-12 mb-4">{title}</h1>
		<div class="border-b border-black border-opacity-30" />
		{#if commonComponentProps.length}
			<div class="py-12 cardGrid" in:fade>
				<svelte:component this={firstRenderComponent} on:click={() => dispatch('first-component-click')} />

				{#each commonComponentProps as props}
					<svelte:component this={commonRenderComponent} {...props} on:click={() => dispatch('component-click', props)} />
				{/each}
			</div>
		{:else}
			<DiamondsLoader />
		{/if}
	</div>
</div>

<style lang="postcss">
	.cardGrid {
		@apply grid min-w-full gap-8;
		grid-template-columns: repeat(auto-fit, 19rem);
	}
</style>
