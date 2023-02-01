<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { Collection } from '$utils/api/collection';

	export let collectionData: Collection;

	const collectionStats = {
		highestSale: {
			stat: 'Highest Sale',
			value: 0,
			symbol: 'WETH',
		},
		floorPrice: {
			stat: 'Floor Price',
			value: 0,
			symbol: 'WETH',
		},
		totalVol: {
			stat: 'Total Volume',
			value: 0,
			symbol: 'WETH',
		},
		items: {
			stat: 'Items',
			value: 0,
			symbol: '',
		},
		owners: {
			stat: 'Owners',
			value: 0,
			symbol: '',
		},
		total24hours: {
			stat: '24Hr Volume',
			value: 0,
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
		<div class="hover:bg-main-gradient flex flex-col items-center justify-center border-gradient border-r-0 w-28 h-20">
			<p class="text-base leading-6">{collectionStats[statKey].stat}</p>
			<h2 class="flex items-center gap-x-2">
				{#if collectionStats[statKey].symbol}
					<Eth class="w-4 h-4" />
				{/if}

				<span class="text-lg leading-6">{collectionStats[statKey].value || 0.0}</span>
			</h2>
		</div>
	{/each}
</div>

<style lang="postcss">
	.stat-wrapper div:last-child {
		@apply border-r-2;
	}
</style>
