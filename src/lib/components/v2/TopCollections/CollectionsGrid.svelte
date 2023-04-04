<script lang="ts">
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';
	import { createEventDispatcher } from 'svelte';
	import HinataBadge from '$icons/hinata-badge.svelte';
	import PlaceholderImageV2 from '$icons/placeholder-image-v2.svelte';
	import type { Collection } from '$utils/api/collection';

	export let collections: Collection[] = [];
	export let isLoading = false;
	export let selectedDuration: '24h' | '7d' | '30d' | 'All' = 'All';

	const dispatch = createEventDispatcher();

	const inviewOptions = {};

	function onChange(event) {
		if (event.detail.inView) {
			dispatch('end-reached');
		}
	}

	const gridTemplateRows =
		collections?.length >= 4 ? 'grid-rows-4' : `grid-rows-${collections?.length}`;

	let parsedStats = [];

	$: collections.map((collection, i) => {
		let currentVol = 0;
		let prevVol = 0;

		switch(selectedDuration) {
			case "All":
				currentVol = +(collection.stats.externalTotalVol + collection.stats.localTotalVol).toFixed(2);
				prevVol = +(
						collection.stats.previousExternalTotalVol + collection.stats.previousLocalTotalVol
				).toFixed(2);
				break;
			case "30d":
				currentVol = +(collection.stats.external30DayVol + collection.stats.local30DayVol).toFixed(2);
				prevVol = +(
						collection.stats.previousExternal30DayVol + collection.stats.previousLocal30DayVol
				).toFixed(2);
				break;
			case "24h":
				currentVol = +(collection.stats.external24Vol + collection.stats.local24Vol).toFixed(2);
				prevVol = +(
						collection.stats.previousExternal24Vol + collection.stats.previousLocal24Vol
				).toFixed(2);
				break;
			case "7d":
				currentVol = +(collection.stats.external7DayVol + collection.stats.local7DayVol).toFixed(2);
				prevVol = +(
						collection.stats.previousExternal7DayVol + collection.stats.previousLocal7DayVol
				).toFixed(2);
				break;

			default:
				currentVol = +(collection.stats.external24Vol + collection.stats.local24Vol).toFixed(2);
				prevVol = +(
						collection.stats.previousExternal24Vol + collection.stats.previousLocal24Vol
				).toFixed(2);
				break;
		}

		parsedStats[i] = {
			volToDisplay: currentVol,
			floorPrice: +collection.stats.localFloorPrice.toFixed(2),
			percentToDisplay:
				prevVol === 0 && currentVol === 0
					? 0
					: prevVol === 0
					? 100
					: +(currentVol / prevVol).toFixed(4) * 100 || 0,
		};

		return collection;
	});
</script>

{#if collections?.length > 0}
	<div class="grid {gridTemplateRows} grid-cols-3 gap-x-20 gap-y-10 justify-between">
		{#each collections as collection, i}
			<a
				href="/collections/{collection.slug}"
				class="flex flex-row items-center text-sm font-bold leading-7 text-white gap-x-6"
			>
				<p class="min-w-[1rem]">{i + 1}</p>
				<div
					class="relative flex items-center justify-center w-14 2xl:w-[70px] h-14 2xl:h-[70px] border-gradient thumbnail bg-cover bg-center"
					style="--url: url({collection?.logoImageUrl ?? ``})"
				>
					{#if !collection?.logoImageUrl}
						<PlaceholderImageV2 class="w-8 h-auto" />
					{/if}

					{#if collection?.mintedFrom?.toLowerCase() === 'hinata'}
						<HinataBadge class="absolute -bottom-2.5 -right-2.5 w-6 h-6" />
					{/if}
				</div>
				<div class="flex-grow">
					<div class="flex flex-row items-center justify-between">
						<h2>{collection?.name}</h2>
						<h2>{parsedStats[i]?.volToDisplay} ETH</h2>
					</div>
					<div
						class="flex flex-row items-center justify-between font-semibold text-sm leading-9 text-[#CECECE]"
					>
						<h3 class="">Floor: {parsedStats[i]?.floorPrice} ETH</h3>

						<h3 class="">
							<!-- Commented out as it is an unclear -->
							<!-- ${parsedStats[i]?.percent24Hr} -->
							{#if parsedStats[i]?.percentToDisplay >= 0}
								<span class="text-[#6FCF97]">{Math.ceil(parsedStats[i]?.percentToDisplay)}%</span>
							{:else if parsedStats[i]?.percentToDisplay < 0}
								<span class="text-[#EB5757]">{Math.ceil(parsedStats[i]?.percentToDisplay)}%</span>
							{/if}
						</h3>
					</div>
				</div>
			</a>
		{/each}
	</div>
{/if}
{#if isLoading}
	<DiamondsLoader />
{:else}
	<div use:inview={inviewOptions} on:change={onChange} />
{/if}
