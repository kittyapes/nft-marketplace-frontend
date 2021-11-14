<script>
	import SidebarItem from '$lib/components/marketplace/SidebarItem.svelte';
	import Back from '../icons/back.icon.svelte';

	import StatusFilter from '$lib/components/marketplace/StatusFilter.svelte';
</script>

<div class="w-72 h-screen fixed border-r border-gray-400 font-bold">
	<div class="p-11 border-b border-gray-400 flex justify-between">
		FILTER
		<button><Back /></button>
	</div>

	<SidebarItem title="Status"><StatusFilter /></SidebarItem>
	<SidebarItem title="Collection">sldkjf</SidebarItem>
	<SidebarItem title="Price">sldkjf</SidebarItem>
</div>
