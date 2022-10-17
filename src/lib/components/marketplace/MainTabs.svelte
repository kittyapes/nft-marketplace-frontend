<script lang="ts">
	export let tab;

	const TABS = ['MARKET', 'COLLECTIONS'];
	const ROUTES = ['marketplace', 'collections'];
</script>

<div class="w-full flex flex-row gap-5 text-sm z-0 items-center">
	{#each TABS as tabName, i}
		<a href={`/${ROUTES[i]}`} class="font-bold" class:text-color-purple={tab == i} class:underline={tab == i}>
			{tabName}
		</a>
		{#if i < TABS.length - 1}
			<div class="w-px h-10 bg-gray-300" />
		{/if}
	{/each}
</div>
