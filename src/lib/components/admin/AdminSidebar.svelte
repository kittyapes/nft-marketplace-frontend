<script>
	import SidebarItem from '$lib/components/admin/AdminSidebarItem.svelte';
	import FiltersIcon from '$icons/filters.svelte';
	import { sidebarItems } from '$constants/admin';
</script>

<div class="w-72 h-auto md:h-screen bg-white md:border-r border-gray-400 font-bold flex-shrink-0">
	<div class="py-6 px-5 border-b border-gray-400 flex justify-between">
		<div class="flex flex-row items-center gap-3 uppercase text-sm">
			<FiltersIcon />
			Admin Dashboard
		</div>
	</div>

	<div>
		{#each sidebarItems as item}
			<SidebarItem title={item.title} href={item.href} icon={item.icon} />
		{/each}
	</div>
</div>
