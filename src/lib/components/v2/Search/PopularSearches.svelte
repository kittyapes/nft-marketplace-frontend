<script lang="ts">
	let popularSearches = [
		'Bored Ape Yacht Club',
		'ChikoRoko Art',
		'Cross The Ages',
		'Rarible',
		'Lens Protocol Profiles',
		'caffNFT',
		'Slotie',
		'CaffeinatedCreatures',
		'Chiko & Roko Art',
		'hit et nunc',
	];
</script>

<div class="font-medium text-xs 2xl:text-base leading-5 2xl:leading-6">
	<h3>Popular</h3>
	{#if popularSearches?.length > 0}
		<div class="mt-3 2xl:mt-4 flex fle-row flex-wrap gap-3 2xl:gap-4 ">
			{#each popularSearches as search}
				<div class="py-3 2xl:py-4 px-4 2xl:px-5 bg-gradient-a">{search}</div>
			{/each}
		</div>
	{/if}
</div>
