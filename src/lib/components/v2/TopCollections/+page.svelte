<script lang="ts">
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import type { Collection } from '$utils/api/collection';
	import CollectionsGrid from './CollectionsGrid.svelte';
	import ButtonGroup from './ButtonGroup.svelte';
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';

	export let collections: Collection[];
</script>

<div class="">
	<div class="text-white w-full flex flex-row items-center justify-between mb-10">
		<h1 class="font-semibold text-2xl leading-7">Top Collections</h1>
		<ButtonGroup on:period={(e) => console.log(e?.detail?.period)} />
	</div>
	{#if collections.length > 0}
		<CollectionsGrid bind:collections />
	{:else}
		<DiamondsLoader />
	{/if}
	<div class="flex justify-center mt-12">
		<Button variant="square" dullgradient class="border-gradient w-52 h-14 whitespace-nowrap text-white text-lg leading-7" on:click={() => goto(`/collections`)}>See all collections</Button>
	</div>
</div>
