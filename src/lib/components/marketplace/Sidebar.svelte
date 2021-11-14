<script>
	import SidebarItem from '$lib/components/marketplace/SidebarItem.svelte';
	import Back from '../icons/back.icon.svelte';
	import Filters from '../icons/filters.icon.svelte';

	import StatusFilter from './StatusFilter.svelte';
	import PriceFilter from './PriceFilter.svelte';
	import CollectionsFilter from './CollectionsFilter.svelte';

	import { slide } from 'svelte/transition';

	export let isOpen = true;
	const toggle = () => (isOpen = !isOpen);
</script>

<div
	class="w-72 h-screen fixed border-r border-gray-400 font-bold transition-all transform duration-200"
	class:w-20={!isOpen}
>
	{#if isOpen}
		<div class="p-11 border-b border-gray-400 flex justify-between">
			<div class="flex flex-row items-center gap-3"><Filters /> FILTER</div>
			<button on:click={toggle}><Back /></button>
		</div>
	{:else}
		<div
			class="py-11 px-5 border-b border-gray-400 flex flex-col items-center justify-center gap-3"
		>
			<div class="text-sm">FILTERS</div>
			<button on:click={toggle} class="rotate-180"><Back /></button>
		</div>
	{/if}

	{#if isOpen}
		<div transition:slide={{ duration: 200 }}>
			<SidebarItem title="Status" iconSrc="/marketplace/status.svg"><StatusFilter /></SidebarItem>
			<SidebarItem title="Collections" iconSrc="/marketplace/collections.svg"
				><CollectionsFilter /></SidebarItem
			>
			<SidebarItem title="Price" iconSrc="/marketplace/price.svg"><PriceFilter /></SidebarItem>
		</div>
	{/if}
</div>
