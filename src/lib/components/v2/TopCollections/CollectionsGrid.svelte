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
	<div class="grid {gridTemplateRows} grid-flow-col gap-y-10 justify-between">
		{#each collections as collection, i}
			<div class="flex flex-row items-center gap-x-6 font-bold text-white text-sm leading-7 ">
				<p>{i + 1}</p>
				<div class="relative w-[70px] h-[70px] border-gradient">
					<div class="w-full h-full overflow-hidden">
						<img class="object-center object-contain" src={collection?.logoImageUrl} alt="Collection Logo" />
					</div>
					<HinataBadge class="absolute -bottom-2.5 -right-2.5 z-50  w-5 h-5 {!collection?.verified ? 'hidden' : ''}" />
				</div>
				<div class="flex-grow">
					<div class="flex flex-row items-center justify-between">
						<h2>{collection?.name}</h2>
						<h2>{collection?.totalVol} ETH</h2>
					</div>
					<div class="flex flex-row items-center justify-between font-semibold text-sm leading-9 text-[#CECECE]">
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
