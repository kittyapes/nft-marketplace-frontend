<script lang="ts">
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { apiGetMostActiveCollections, type Collection } from '$utils/api/collection';
	import CollectionsGrid from './CollectionsGrid.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import PrimaryButton from '../PrimaryButton/PrimaryButton.svelte';

	export let collections: Collection[] = [];

	onMount(async () => {
		collections = (await apiGetMostActiveCollections()).collections;
	});
</script>

<div class="">
	<div class="text-white w-full flex flex-row items-center justify-between mb-10">
		<h1 class=" text-2xl leading-7">Top Collections</h1>
		<!-- TODO implement top collections filter -->
		<!-- <ButtonGroup on:period={(e) => console.log(e?.detail?.period)} /> -->
	</div>
	{#if collections.length > 0}
		<CollectionsGrid bind:collections />
	{:else}
		<DiamondsLoader />
	{/if}
	<div class="flex justify-center mt-12 w-full">
		<PrimaryButton on:click={() => goto(`/collections`)} extButtonClass="w-80">See all collections</PrimaryButton>
	</div>
</div>
