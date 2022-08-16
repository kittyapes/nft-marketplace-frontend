<script>
	import ArrowLeft from '$icons/arrow-left.svelte';
	import Filters from '$icons/filters.svelte';
	import SidebarItem from '$lib/components/marketplace/SidebarItem.svelte';
	import { slide } from 'svelte/transition';
	import CollectionsFilter from './CollectionsFilter.svelte';
	import PriceFilter from './PriceFilter.svelte';
	import StatusFilter from './StatusFilter.svelte';

	export let isOpen = true;
	const toggle = () => (isOpen = !isOpen);
</script>

<div
	class={`w-full overflow-auto max-h-[calc(100vh-4rem)] scrollbar-hide 
	${!isOpen ? 'md:w-20' : 'md:w-72'} 
	h-auto md:h-screen block md:fixed border-t bg-white md:border-r border-gray-400 font-bold transition-all transform duration-200 ${$$props.class}`}
>
	{#if isOpen}
		<div class="flex justify-between border-b border-gray-400 p-11">
			<div class="flex flex-row items-center gap-3">
				<Filters />
				FILTER
			</div>

			<button on:click={toggle} class="rotate-90 md:rotate-0">
				<ArrowLeft />
			</button>
		</div>
	{:else}
		<div class="flex flex-row items-center justify-center gap-3 px-5 border-b border-gray-400 py-11 md:flex-col">
			<div class="text-sm">FILTERS</div>
			<button on:click={toggle} class="-rotate-90 md:rotate-180">
				<ArrowLeft />
			</button>
		</div>
	{/if}

	{#if isOpen}
		<div transition:slide={{ duration: 200 }}>
			<SidebarItem title="Show Only" icon="status">
				<StatusFilter on:request-refresh />
			</SidebarItem>

			<SidebarItem title="Collections" icon="collection">
				<CollectionsFilter on:request-refresh />
			</SidebarItem>

			<SidebarItem title="Price" icon="price">
				<PriceFilter on:request-refresh />
			</SidebarItem>
		</div>
	{/if}
</div>
