<script>
	import History from '$icons/history.svelte';
	import Info from '$icons/info.svelte';
	import Claims from '$icons/claims.svelte';

	export let selectedTab = 0;
</script>

<div class="flex gap-5 w-full">
	<div
		class="flex items-center gap-1 font-bold cursor-pointer"
		on:click={() => (selectedTab = 0)}
		class:opacity-50={selectedTab == 0}
	>
		<Info /> INFO
	</div>
	<div
		class="flex items-center gap-1 font-bold cursor-pointer"
		on:click={() => (selectedTab = 1)}
		class:opacity-50={selectedTab == 1}
	>
		<Claims /> CLAIMS
	</div>
	<div
		class="flex items-center gap-1 font-bold cursor-pointer"
		on:click={() => (selectedTab = 2)}
		class:opacity-50={selectedTab == 2}
	>
		<History /> HISTORY
	</div>

</div>


