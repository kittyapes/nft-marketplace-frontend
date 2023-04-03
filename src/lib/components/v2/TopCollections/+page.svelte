<script lang="ts">
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { apiGetMostActiveCollections, type Collection } from '$utils/api/collection';
	import CollectionsGrid from './CollectionsGrid.svelte';
	import { goto } from '$app/navigation';
	import PrimaryButton from '../PrimaryButton/PrimaryButton.svelte';
	import ButtonGroup from './ButtonGroup.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	export let collections: Collection[] = [];
	const selectedSortPeriod = writable<'24h' | '7d' | '30d' | 'All' | null>('All');

	const sortMap: {
		[key: string]:
			| 'ALPHABETICAL'
			| 'CREATED_AT'
			| 'ONE_DAY_VOLUME'
			| 'SEVEN_DAYS_VOLUME'
			| 'THIRTY_DAYS_VOLUME'
			| 'TOTAL_VOLUME';
	} = {
		'24h': 'ONE_DAY_VOLUME',
		'7d': 'SEVEN_DAYS_VOLUME',
		'30d': 'THIRTY_DAYS_VOLUME',
		All: 'TOTAL_VOLUME',
	};

	onMount(() => selectedSortPeriod.set('All'));

	async function loadCollections() {
		if ($selectedSortPeriod) {
			collections = (await apiGetMostActiveCollections(sortMap[$selectedSortPeriod])).collections;
		}
	}

	selectedSortPeriod.subscribe(async (sort) => {
		sort && (await loadCollections());
	});
</script>

<div class="">
	<div class="text-white w-full flex flex-row items-center justify-between mb-10">
		<h1 class=" text-2xl leading-7">Top Collections</h1>
		<!-- TODO implement top collections filter -->
		<!-- <ButtonGroup
			on:period={(e) => selectedSortPeriod.set(e?.detail?.period)}
			selectedPeriod={$selectedSortPeriod}
		/> -->
	</div>
	{#if collections.length > 0}
		<CollectionsGrid bind:collections />
	{:else}
		<DiamondsLoader />
	{/if}
	<div class="flex justify-center mt-12 w-full">
		<PrimaryButton on:click={() => goto(`/collections`)} extButtonClass="w-80">
			See all collections
		</PrimaryButton>
	</div>
</div>
