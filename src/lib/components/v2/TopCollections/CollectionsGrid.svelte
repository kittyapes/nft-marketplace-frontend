<script lang="ts">
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';
	import { createEventDispatcher } from 'svelte';
	import HinataBadge from '$icons/hinata-badge.svelte';
	import PlaceholderImageV2 from '$icons/placeholder-image-v2.svelte';
	import type { Collection } from '$utils/api/collection';

	export let collections: Collection[] = [];
	export let isLoading = false;

	const dispatch = createEventDispatcher();

	const inviewOptions = {};

	function onChange(event) {
		if (event.detail.inView) {
			dispatch('end-reached');
		}
	}

	const gridTemplateRows =
		collections?.length >= 4 ? 'grid-rows-4' : `grid-rows-${collections?.length}`;
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
						<h2>
							{+(collection.stats.volToDisplay || 0).toFixed(2)} ETH
						</h2>
					</div>
					<div
						class="flex flex-row items-center justify-between font-semibold text-sm leading-9 text-[#CECECE]"
					>
						<h3 class="">Floor: {+(collection.stats.localFloorPrice.toFixed(4))} ETH</h3>

						<h3 class="">
							<!-- Commented out as it is an unclear -->
							<!-- ${parsedStats[i]?.percent24Hr} -->
							{#if collection.stats.volChangePercent >= 0}
								<span class="text-[#6FCF97]">{+(collection.stats.volChangePercent).toFixed(4)}%</span>
							{:else if collection.stats.volChangePercent < 0}
								<span class="text-[#EB5757]">{+(collection.stats.volChangePercent).toFixed(4)}%</span>
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
