<script>
	import SidebarItem from '$lib/components/admin/AdminSidebarItem.svelte';
	import Filters from '$icons/filters.svelte';
</script>

<div
	class="w-72 h-auto md:h-screen border-t bg-white md:border-r border-gray-400 font-bold flex-shrink-0"
>
	<div class="py-4 px-5 border-b border-gray-400 flex justify-between">
		<div class="flex flex-row items-center gap-3 uppercase text-sm">
			<Filters />
			Admin Dashboard
		</div>
	</div>

	<div>
		<SidebarItem title="Create" href="/admin/" iconSrc="/marketplace/status.svg" />

		<SidebarItem
			title="User management"
			href="/admin/users"
			iconSrc="/marketplace/collections.svg"
		/>

		<SidebarItem title="Analytics" href="/admin/analytics" iconSrc="/marketplace/price.svg" />
	</div>
</div>
