<script lang="ts">
	import type { CollectionTableRow } from '$utils/api/collection';
	import CollectionsTable from './CollectionsTable.svelte';

	export let collections: CollectionTableRow[];
	export let isLoading: boolean;

	$: displayCollections = collections;

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
	<CollectionsTable {isLoading} {collections} on:end-reached />
</div>
