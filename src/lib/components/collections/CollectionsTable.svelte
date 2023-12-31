<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { seperateNumberWithCommas } from '$utils/misc/seperateNumberWithSeparators';
	import { slide } from 'svelte/transition';
	import type { Collection } from '$utils/api/collection';
	import HinataBadge from '$icons/hinata-badge.svelte';
	import LoaderScreen from '../LoaderScreen.svelte';

	export let collections: (Collection & { ranking?: number })[];
	export let isLoading = false;

	let parsedStats = [];

	$: collections.map((collection, i) => {
		const dailyVol = +(collection.stats.external24Vol + collection.stats.local24Vol).toFixed(2);
		const prevDailyVol = +(
			collection.stats.previousExternal24Vol + collection.stats.previousLocal24Vol
		).toFixed(2);

		parsedStats[i] = {
			totalVol: +(collection.stats.externalTotalVol + collection.stats.localTotalVol).toFixed(2),
			floorPrice: +collection.stats.localFloorPrice.toFixed(2),
			vol24Hr: dailyVol,
			percent24Hr:
				prevDailyVol === 0 && dailyVol === 0
					? 0
					: prevDailyVol === 0
					? 100
					: +(dailyVol / prevDailyVol).toFixed(4) * 100 || 0,
		};

		return collection;
	});
</script>

{#if isLoading}
	<LoaderScreen />
{:else}
	<div class="w-full flex flex-col gap-10 bg-dark-gradient">
		<div class="w-full flex flex-col">
			<div
				class="grid w-[95%] grid-cols-[8.5fr_1.5fr_3fr_2fr_3fr] text-center text-xs text-white py-5"
			>
				<div />
				<div class="uppercase">Floor</div>
				<div class="uppercase">Total vol</div>
				<div class="uppercase">24h vol</div>
				<div class="uppercase">24h vol %</div>
			</div>
			{#each collections as collection, i}
				<div
					class="grid w-full py-4 border-t border-white border-opacity-[0.15] "
					transition:slide|local
				>
					<div class="grid grid-cols-[1.5fr_7fr_1.5fr_3fr_2fr_3fr] w-[95%] place-items-center">
						<div class="text-center text-sm grid place-items-center">
							{collection.ranking || i + 1}
						</div>
						<a
							href={'/collections/' + collection.slug}
							class="flex place-items-center gap-6 place-self-start clickable w-full"
						>
							<div
								class="w-12 h-12 background profile-pic bg-cover rounded-full"
								style="--url: url({collection.logoImageUrl ?? ''})"
							/>
							<div class="flex font-semibold text-sm gap-2 ">
								{collection.name}
								{#if collection.mintedFrom?.toLowerCase() === 'hinata'}
									<HinataBadge />
								{/if}
							</div>
						</a>
						<div class="flex place-items-center gap-2 text-sm">
							<Eth />
							{seperateNumberWithCommas(parsedStats[i]?.floorPrice)}
						</div>
						<div class="flex place-items-center gap-2 text-sm">
							<Eth />
							{seperateNumberWithCommas(parsedStats[i]?.totalVol)}
						</div>
						<div class="flex place-items-center gap-2 text-sm">
							<Eth />
							{seperateNumberWithCommas(parsedStats[i]?.vol24Hr)}
						</div>
						<div
							class="flex place-items-center text-sm text-color-green"
							class:text-color-red={parsedStats[i]?.percent24Hr < 0}
						>
							{+parsedStats[i]?.percent24Hr.toFixed(4)}%
							<div class:rotate-180={parsedStats[i]?.percent24Hr >= 0}>
								<ArrowDown />
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style lang="postcss">
	.profile-pic {
		background-image: var(--url);
	}
</style>
