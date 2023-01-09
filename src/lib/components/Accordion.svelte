<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import { slide } from 'svelte/transition';
	import Separator from './Separator.svelte';

	export let accordionLabel: string;
	export let isExpanded = false;
</script>

<div id="filter-accordion" class="w-full flex flex-col gap-y-8 2xl:gap-y-10 pb-8 2xl:pb-10 hover:cursor-pointer">
	<div on:click={() => (isExpanded = !isExpanded)}>
		<Separator class="bg-main-gradient" />

		<div class="flex items-center justify-between pt-8 2xl:pt-10">
			<h3 class="font-semibold text-xl 2xl:text-2xl leading-6 2xl:leading-7">{accordionLabel}</h3>

			<ArrowDown class="transition transform {isExpanded ? 'rotate-180' : 'rotate-0'}" />
		</div>
	</div>

	{#if isExpanded}
		<div transition:slide={{ duration: 300 }}>
			<slot />
		</div>
	{/if}
</div>
