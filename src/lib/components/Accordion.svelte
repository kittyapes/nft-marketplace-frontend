<script lang="ts">
	import { browser } from '$app/environment';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Separator from './Separator.svelte';

	export let accordionLabel: string;
	export let isExpanded = true;
	let isFirstChild = false;
	onMount(() => {
		const accordionNode = browser && document.getElementById('filter-accordion');
		const parentNode = accordionNode?.parentNode;
		if (parentNode?.firstChild === accordionNode) isFirstChild = true;
	});
</script>

<div id="filter-accordion" class="w-full flex flex-col gap-y-8 2xl:gap-y-10 pb-8 2xl:pb-10 hover:cursor-pointer">
	<div
		on:click={() => {
			isExpanded = !isExpanded;
		}}
	>
		<Separator class="bg-main-gradient" />

		<div class="flex items-center justify-between pt-8 2xl:pt-10">
			<h3 class="font-semibold text-xl 2xl:text-2xl leading-6 2xl:leading-7">{accordionLabel}</h3>
			<ArrowDown class="w-3.5 2xl:w-4 h-1.5 2xl:h-2 transform {isExpanded ? 'rotate-180' : 'rotate-0'}" />
		</div>
	</div>
	{#if isExpanded}
		<div transition:slide={{ duration: 300 }}>
			<slot />
		</div>
	{/if}
</div>
