<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { seperateNumberWithCommas } from '$utils/misc/seperateNumberWithSeparators';
	import Dropdown from '../Dropdown.svelte';
	import { slide } from 'svelte/transition';
	import type { CollectionTableRow } from '$utils/api/collection';
	import CollectionsTable from './CollectionsTable.svelte';

	export let collections: CollectionTableRow[];
	export let viewCollectionsCount = 10;

	// $: displayCollections = [...collections].slice(0, viewCollectionsCount);
	$: displayCollections = collections;
	let currentCollectionsCount = viewCollectionsCount;
	let options = [
		{
			label: 'HIGHEST TOTAL VOL'
		},
		{
			label: 'HIGHEST 24H VOL'
		},
		{
			label: 'HIGHEST 24H VOL %'
		},
		{
			label: 'HIGHEST FLOOR'
		}
	];
	let selection: 'ALL' | 'VERIFIED' = 'ALL';

	let filter = (status: string) => {
		// displayCollections = [...collections].slice(0, currentCollectionsCount);
		if (status === 'VERIFIED') {
			displayCollections = [...displayCollections].filter((e) => e.verified);
			selection = 'VERIFIED';
		} else {
			selection = 'ALL';
		}
	};

	let changeView = (change: 'less' | 'more') => {
		if (change === 'less') {
			currentCollectionsCount -= viewCollectionsCount;
		} else {
			if (currentCollectionsCount + viewCollectionsCount >= collections.length) {
				currentCollectionsCount = collections.length;
			} else {
				currentCollectionsCount += viewCollectionsCount;
			}
		}
		filter(selection);
	};

	let handleSelect = (event?: CustomEvent) => {
		if (!event) {
			collections.sort((a, b) => b.totalVol - a.totalVol);
			displayCollections.sort((a, b) => b.totalVol - a.totalVol);
			displayCollections = displayCollections;
			return;
		}
		if (event.detail.label === 'HIGHEST 24H VOL %') {
			collections.sort((a, b) => b['24hourPercent'] - a['24hourPercent']);
			displayCollections.sort((a, b) => b['24hourPercent'] - a['24hourPercent']);
		} else if (event.detail.label === 'HIGHEST 24H VOL') {
			collections.sort((a, b) => b.total24hours - a.total24hours);
			displayCollections.sort((a, b) => b.total24hours - a.total24hours);
		} else if (event.detail.label === 'HIGHEST TOTAL VOL') {
			collections.sort((a, b) => b.totalVol - a.totalVol);
			displayCollections.sort((a, b) => b.totalVol - a.totalVol);
		} else if (event.detail.label === 'HIGHEST FLOOR') {
			collections.sort((a, b) => b.floorPrice - a.floorPrice);
			displayCollections.sort((a, b) => b.floorPrice - a.floorPrice);
		}
		displayCollections = displayCollections;
	};

	$: collections && handleSelect();
</script>

<div class="w-full flex flex-col gap-10">
	<!-- Filters, which no longer appear in the designs. -->

	<!-- <div class="flex font-semibold text-xs gap-0 w-full">
		<button class="uppercase btn w-28 h-12 transition-colors bg-color-gray-lighter text-color-gray-base" class:btn-gradient={selection === 'ALL'} on:click={() => filter('ALL')}>all</button>
		<button class="uppercase btn w-28 h-12 bg-color-gray-lighter text-color-gray-base transition-colors" class:btn-gradient={selection === 'VERIFIED'} on:click={() => filter('VERIFIED')}>
			verified
		</button>
		<div class="flex-grow" />
		<Dropdown {options} on:select={handleSelect} class="w-40 bg-color-gray-lighter" />
	</div> -->

	<CollectionsTable {collections} />
</div>

<style lang="postcss">
	.profile-pic {
		background-image: var(--url);
	}
</style>
