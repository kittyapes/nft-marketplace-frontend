<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { Collection } from '$utils/api/collection';

	export let collectionData: Collection;

	$: dailyVol = +(collectionData?.stats.external24Vol + collectionData?.stats.local24Vol).toFixed(
		2,
	);
	$: prevDailyVol = +(
		collectionData?.stats.previousExternal24Vol + collectionData?.stats.previousLocal24Vol
	).toFixed(2);

	$: parsedStats = {
		totalVol: +(
			collectionData?.stats.externalTotalVol + collectionData?.stats.localTotalVol
		).toFixed(2),
		floorPrice: +collectionData?.stats.localFloorPrice.toFixed(2),
		vol24Hr: dailyVol,
		percent24Hr:
			prevDailyVol === 0 && dailyVol === 0
				? 0
				: prevDailyVol === 0
				? 100
				: +(dailyVol / prevDailyVol).toFixed(4) * 100 || 0,
	};

	$: collectionStats = {
		highestSale: {
			stat: 'Highest Sale',
			value: collectionData?.stats.localHighestSale,
			symbol: 'WETH',
		},
		floorPrice: {
			stat: 'Floor Price',
			value: collectionData?.stats.localFloorPrice,
			symbol: 'WETH',
		},
		totalVol: {
			stat: 'Total Volume',
			value: parsedStats.totalVol,
			symbol: 'WETH',
		},
		items: {
			stat: 'Items',
			value: collectionData?.stats.numOfItems,
			symbol: '',
		},
		owners: {
			stat: 'Owners',
			value: collectionData?.stats.numOfOwners,
			symbol: '',
		},
		total24hours: {
			stat: '24Hr Volume',
			value: dailyVol,
			symbol: 'WETH',
		},
	};

	$: if (collectionData) {
		let formatter = Intl.NumberFormat('en', { notation: 'compact' });
		Object.keys(collectionStats).map((key) => {
			if (collectionData?.[key]) {
				collectionStats[key].value = formatter.format(collectionData[key]);
			}
		});
	}
</script>

<div class="flex flex-row items-center text-base leading-6 stat-wrapper">
	{#each Object.keys(collectionStats) as statKey}
		<div
			class="hover:bg-main-gradient hover:cursor-pointer flex flex-col items-center justify-center border-gradient border-r-0 w-24 h-16"
		>
			<p class="text-sm leading-6">{collectionStats[statKey].stat}</p>
			<h2 class="flex items-center gap-x-2">
				{#if collectionStats[statKey].symbol}
					<Eth class="w-4 h-4" />
				{/if}

				<span class="text-base leading-6">{collectionStats[statKey].value || 0.0}</span>
			</h2>
		</div>
	{/each}
</div>

<style lang="postcss">
	.stat-wrapper div:last-child {
		@apply border-r-2;
	}
</style>
