<script lang="ts">
	import type { Collection } from '$utils/api/collection';
	import CollectionsTable from './CollectionsTable.svelte';

	export let collections: (Collection & { ranking?: number })[];
	export let isLoading: boolean;

	$: displayCollections = collections;

	let handleSelect = (event?: CustomEvent) => {
		if (!event) {
			collections.sort((a, b) => {
				const aTotal = a.stats.externalTotalVol + a.stats.localTotalVol;
				const bTotal = b.stats.externalTotalVol + b.stats.localTotalVol;

				return bTotal - aTotal;
			});
			displayCollections.sort((a, b) => {
				const aTotal = a.stats.externalTotalVol + a.stats.localTotalVol;
				const bTotal = b.stats.externalTotalVol + b.stats.localTotalVol;

				return bTotal - aTotal;
			});
			displayCollections = displayCollections;
			return;
		}
		if (event.detail.label === 'HIGHEST 24H VOL %') {
			collections.sort((a, b) => {
				const aTotal = a.stats.external24Vol + a.stats.local24Vol;
				const bTotal = b.stats.external24Vol + b.stats.local24Vol;
				const aPreviousTotal = a.stats.previousExternal24Vol + a.stats.previousLocal24Vol;
				const bPreviousTotal = b.stats.previousExternal24Vol + b.stats.previousLocal24Vol;

				return (bTotal - aTotal) / (bPreviousTotal - aPreviousTotal);
			});
			displayCollections.sort((a, b) => {
				const aTotal = a.stats.external24Vol + a.stats.local24Vol;
				const bTotal = b.stats.external24Vol + b.stats.local24Vol;
				const aPreviousTotal = a.stats.previousExternal24Vol + a.stats.previousLocal24Vol;
				const bPreviousTotal = b.stats.previousExternal24Vol + b.stats.previousLocal24Vol;

				return (bTotal - aTotal) / (bPreviousTotal - aPreviousTotal);
			});
		} else if (event.detail.label === 'HIGHEST 24H VOL') {
			collections.sort((a, b) => {
				const aTotal = a.stats.external24Vol + a.stats.local24Vol;
				const bTotal = b.stats.external24Vol + b.stats.local24Vol;

				return aTotal - bTotal;
			});
			displayCollections.sort((a, b) => {
				const aTotal = a.stats.external24Vol + a.stats.local24Vol;
				const bTotal = b.stats.external24Vol + b.stats.local24Vol;

				return bTotal - aTotal;
			});
		} else if (event.detail.label === 'HIGHEST TOTAL VOL') {
			collections.sort((a, b) => {
				const aTotal = a.stats.externalTotalVol + a.stats.localTotalVol;
				const bTotal = b.stats.externalTotalVol + b.stats.localTotalVol;

				return bTotal - aTotal;
			});
			displayCollections.sort((a, b) => {
				const aTotal = a.stats.externalTotalVol + a.stats.localTotalVol;
				const bTotal = b.stats.externalTotalVol + b.stats.localTotalVol;

				return bTotal - aTotal;
			});
		} else if (event.detail.label === 'HIGHEST FLOOR') {
			collections.sort((a, b) => b.stats.localFloorPrice - a.stats.localFloorPrice);
			displayCollections.sort((a, b) => b.stats.localFloorPrice - a.stats.localFloorPrice);
		}
		displayCollections = displayCollections;
	};

	$: collections && handleSelect();
</script>

<div class="w-full flex flex-col gap-10">
	<CollectionsTable {isLoading} {collections} />
</div>
