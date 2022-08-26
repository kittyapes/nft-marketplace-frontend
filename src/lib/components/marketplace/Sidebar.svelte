<script lang="ts">
	import ArrowLeft from '$icons/arrow-left.svelte';
	import Filters from '$icons/filters.svelte';
	import SidebarItem from '$lib/components/marketplace/SidebarItem.svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import CollectionsFilter from './CollectionsFilter.svelte';
	import PriceFilter from './PriceFilter.svelte';
	import StatusFilter from './StatusFilter.svelte';

	export let isOpen = true;
	const toggle = () => (isOpen = !isOpen);

	const tabs = [
		{
			title: 'Show Only',
			icon: 'status',
			queryString: 'types',
			renderComponent: StatusFilter,
			open: false,
			state: '',
			setState: (params: string) => {
				return params;
			}
		},
		{
			title: 'Collections',
			icon: 'collection',
			queryString: 'collections',
			renderComponent: CollectionsFilter,
			open: false,
			state: '',
			setState: (params: string) => {
				console.log(params);
				return '';
			}
		},
		{
			title: 'Price',
			icon: 'price',
			queryString: 'token',
			renderComponent: PriceFilter,
			open: false,
			state: '',
			setState: (params: string) => {
				console.log(params);
				return '';
			}
		}
	];

	let loaded = false;

	onMount(() => {
		// open filter tabs if page refreshed with filters
		tabs.forEach((t) => {
			if ($page.url.searchParams.has(t.queryString)) {
				let searchParamsValue = $page.url.searchParams.get(t.queryString);

				t.state = t.setState(searchParamsValue);
				t.open = true;
			}
		});

		loaded = true;
	});
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

	{#if isOpen && loaded}
		<div transition:slide={{ duration: 200 }}>
			{#each tabs as tab}
				<SidebarItem title={tab.title} icon={tab.icon} isOpen={tab.open}>
					<svelte:component this={tab.renderComponent} state={tab.state} on:request-refresh />
				</SidebarItem>
			{/each}
		</div>
	{/if}
</div>
