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
	const selectedSortPeriod = writable<'24h' | '7d' | '30d' | 'All'>('All');

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
			collections = (await apiGetMostActiveCollections(sortMap[$selectedSortPeriod])).collections.map((collection) => {

				let currentVol = 0;
				let prevVol = 0;

				switch($selectedSortPeriod) {
					case '24h':
						currentVol = (collection.stats.total24Vol || collection.stats.external24Vol + collection.stats.local24Vol || 0);
						prevVol = (collection.stats.previousTotal24Vol || collection.stats.previousExternal24Vol + collection.stats.previousLocal24Vol || 0);
						break;
					case '7d':
						currentVol = (collection.stats.total7DayVol || collection.stats.external7DayVol + collection.stats.local7DayVol || 0);
						prevVol = (collection.stats.previousTotal7DayVol || collection.stats.previousExternal7DayVol + collection.stats.previousLocal7DayVol || 0);
						break;
					case '30d':
						currentVol = (collection.stats.total30DayVol || collection.stats.external30DayVol + collection.stats.local30DayVol || 0);
						prevVol = (collection.stats.previousTotal30DayVol || collection.stats.previousExternal30DayVol + collection.stats.previousLocal30DayVol || 0);
						break;
					default:
						currentVol = (collection.stats.totalVol || collection.stats.externalTotalVol + collection.stats.localTotalVol || 0);
						prevVol = (collection.stats.previousTotalVol || collection.stats.previousExternalTotalVol + collection.stats.previousLocalTotalVol || 0);
						break;
				}

				collection.stats.volChangePercent = (currentVol - prevVol) / currentVol * 100;
				collection.stats.volToDisplay = currentVol;

				return collection;
			});
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
		<ButtonGroup
			on:period={(e) => selectedSortPeriod.set(e?.detail?.period || 'All')}
			selectedPeriod={$selectedSortPeriod}
		/>
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
