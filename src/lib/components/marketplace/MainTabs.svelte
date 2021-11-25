<script>
	export let tab;
	const TABS = ['MARKET', 'DROPS', 'POWAH', 'PHYSICAL NFT'];
	const ROUTES = ['marketplace', 'drops', 'powah', 'physical'];
</script>

<div class="w-full flex flex-row gap-5 text-xs z-0 items-center">
	{#each TABS as tabName, i}
		<a
			href={`/${ROUTES[i]}`}
			class="font-bold"
			class:text-color-purple={tab == i}
			class:underline={tab == i}
		>
			{tabName}
		</a>
		<div class="w-px h-10 bg-gray-300" />
	{/each}
</div>
