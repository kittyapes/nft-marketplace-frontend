<script>
	import MainTabs from '$lib/components/marketplace/MainTabs.svelte';
	import Sidebar from '$lib/components/drops/DropsSidebar.svelte';
	import DropsSection from '$lib/sections/MarketplaceDropsSection.svelte';

	let sidebarOpen;
</script>

<div class="w-full min-h-screen h-full flex flex-col md:flex-row">
	<Sidebar bind:isOpen={sidebarOpen} />

	<div
		class={`p-11 w-full ml-0 ${
			!sidebarOpen ? 'md:ml-24' : 'md:ml-72'
		} transform transition-all duration-200`}
	>
		<MainTabs tab={1} />

		<div class="w-full h-px bg-gray-400 mt-7" />

		<div class="w-full flex justify-between mt-3">
			<!-- Active filters -->
		</div>

		<div>
			<DropsSection />
		</div>
	</div>
</div>
