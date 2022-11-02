<script lang="ts">
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import type { Collection } from '$utils/api/collection';
	import CollectionsGrid from './CollectionsGrid.svelte';
	import ButtonGroup from './ButtonGroup.svelte';
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	export let collections: Collection[];
</script>

<div class="px-[7.85vw] pt-[5.6vw] mb-[3.75vw]">
	<div class="text-white w-full flex flex-row items-center justify-between mb-[2.32vw]">
		<h1 class="font-semibold text-[1.4vw] leading-[1.6vw]">Top Collections</h1>
		<ButtonGroup on:period={(e) => console.log(e?.detail?.period)} />
	</div>
	{#if collections.length > 0}
		<CollectionsGrid bind:collections />
	{:else}
		<DiamondsLoader />
	{/if}
	<div class="flex justify-center mt-[2.9vw]">
		<Button variant="square" dullgradient class="border-gradient w-[12vw] h-[3.19vw] whitespace-nowrap text-white text-[1vw] leading-[1.7vw]" on:click={() => goto(`/collections`)}>
			See all collections
		</Button>
	</div>
</div>
