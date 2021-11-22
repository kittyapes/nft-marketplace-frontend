<script>
	import SidebarItem from '$lib/components/marketplace/SidebarItem.svelte';
	import Arrow from '$lib/icons/back.icon.svelte';
	import Filters from '$lib/icons/filters.icon.svelte';

	import StatusFilter from './StatusFilter.svelte';
	import PriceFilter from './PriceFilter.svelte';
	import CollectionsFilter from './CollectionsFilter.svelte';

	import { slide } from 'svelte/transition';

	export let isOpen = true;
	const toggle = () => (isOpen = !isOpen);
</script>

<div
	class={`w-full ${
		!isOpen ? 'md:w-20' : 'md:w-72'
	} h-auto md:h-screen block md:fixed border-t bg-white md:border-r border-gray-400 font-bold transition-all transform duration-200`}
>
	{#if isOpen}
		<div class="p-11 border-b border-gray-400 flex justify-between">
			<div class="flex flex-row items-center gap-3">
				<Filters />
				FILTER
			</div>

			<button on:click={toggle} class="rotate-90 md:rotate-0">
				<Arrow />
			</button>
		</div>
	{:else}
		<div
			class="py-11 px-5 border-b border-gray-400 flex flex-row md:flex-col items-center justify-center gap-3"
		>
			<div class="text-sm">FILTERS</div>
			<button on:click={toggle} class="-rotate-90 md:rotate-180">
				<Arrow />
			</button>
		</div>
	{/if}

	{#if isOpen}
		<div transition:slide={{ duration: 200 }}>
			<SidebarItem title="Status" iconSrc="/marketplace/status.svg"><StatusFilter /></SidebarItem>

			<SidebarItem title="Collections" iconSrc="/marketplace/collections.svg">
				<CollectionsFilter />
			</SidebarItem>

			<SidebarItem title="Price" iconSrc="/marketplace/price.svg"><PriceFilter /></SidebarItem>
		</div>
	{/if}
</div>
