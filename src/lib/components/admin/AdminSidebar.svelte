<script>
	import SidebarItem from '$lib/components/admin/AdminSidebarItem.svelte';
	import { sidebarItems } from '$constants/admin';
</script>

<div class="w-72 h-auto md:h-screen bg-white md:border-r border-gray-400 font-bold flex-shrink-0">
	<div>
		{#each sidebarItems as item}
			<SidebarItem title={item.title} href={item.href} icon={item.icon} arrow={item.arrow} />
		{/each}
	</div>
</div>
