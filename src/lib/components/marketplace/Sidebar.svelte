<script>
	import SidebarItem from '$lib/components/marketplace/SidebarItem.svelte';
	import Back from '../icons/back.icon.svelte';
	import Filters from '../icons/filters.icon.svelte';

	import StatusFilter from '$lib/components/marketplace/StatusFilter.svelte';
</script>

<div class="w-72 h-screen fixed border-r border-gray-400 font-bold">
	<div class="p-11 border-b border-gray-400 flex justify-between">
		<div class="flex flex-row items-center gap-3"><Filters /> FILTER</div>
		<button><Back /></button>
	</div>

	<SidebarItem title="Status" iconSrc="/marketplace/status.svg"><StatusFilter /></SidebarItem>
	<SidebarItem title="Collections" iconSrc="/marketplace/collections.svg">sldkjf</SidebarItem>
	<SidebarItem title="Price" iconSrc="/marketplace/price.svg">sldkjf</SidebarItem>
</div>
