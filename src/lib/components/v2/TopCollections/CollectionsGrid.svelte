<script lang="ts">
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';
	import { createEventDispatcher } from 'svelte';
	import HinataBadge from '$icons/hinata-badge.svelte';
	import type { Collection } from '$utils/api/collection';

	const dispatch = createEventDispatcher();

	export let collections: Collection[];
	export let isLoading = false;
	const inviewOptions = {};
	function onChange(event) {
		if (event.detail.inView) {
			dispatch('end-reached');
		}
	}
	const gridTemplateRows = collections?.length >= 4 ? 'grid-rows-4' : `grid-rows-${collections?.length}`;
</script>

{#if collections?.length > 0}
	<div class="grid {gridTemplateRows} grid-flow-col gap-y-[2.3vw] justify-between">
		{#each collections as collection, i}
			<div class="w-[22.56vw] flex flex-row items-center gap-x-[1.5vw] font-bold text-white text-[0.87vw] leading-[1.6vw]">
				<p>{i + 1}</p>
				<div class="relative w-[4vw] h-[4vw] border-gradient">
					<div class="w-full h-full overflow-hidden">
						<img class="object-center object-contain" src={collection?.logoImageUrl} alt="Collection Logo" />
					</div>
					<HinataBadge class="absolute -bottom-[0.58vw] -right-[0.58vw] z-50  w-[1.16vw] h-[1.16vw] {!collection?.verified ? 'hidden' : ''}" />
				</div>
				<div class="flex-grow">
					<div class="flex flex-row items-center justify-between">
						<h2>{collection?.name}</h2>
						<h2>{collection?.totalVol} ETH</h2>
					</div>
					<div class="flex flex-row items-center justify-between font-semibold text-[0.81vw] leading-[2.1vw] text-[#CECECE]">
						<h3 class="">Floor: {collection.floorPrice} ETH</h3>
						<h3 class="">
							${collection.total24hours}K
							{#if collection?.['24hourPercent'] > 0}
								<span class="text-[#6FCF97]">{collection?.['24hourPercent']}%</span>
							{:else if collection?.['24hourPercent'] < 0}
								<span class="text-[#EB5757]">{collection?.['24hourPercent']}%</span>
							{/if}
						</h3>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
{#if isLoading}
	<DiamondsLoader />
{:else}
	<div use:inview={inviewOptions} on:change={onChange} />
{/if}
