<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { seperateNumberWithCommas } from '$utils/misc/seperateNumberWithSeparators';
	import { slide } from 'svelte/transition';
	import type { Collection } from '$utils/api/collection';
	import { goto } from '$app/navigation';
	import { inview } from 'svelte-inview';
	import { createEventDispatcher } from 'svelte';
	import DiamondsLoader from '../DiamondsLoader.svelte';

	const dispatch = createEventDispatcher();

	export let collections: Collection[];
	export let isLoading = false;

	const inviewOptions = {};

	function onChange(event) {
		if (event.detail.inView) {
			dispatch('end-reached');
		}
	}
</script>

<div class="w-full flex flex-col gap-10 bg-[#FAFAFA]">
	<div class="w-full flex flex-col">
		<div class="grid w-[95%] grid-cols-[8.5fr_1.5fr_3fr_2fr_3fr] text-center text-xs text-color-gray-base py-5 font-bold">
			<div />
			<div class="uppercase">Floor</div>
			<div class="uppercase">Total vol</div>
			<div class="uppercase">24h vol</div>
			<div class="uppercase">24h vol %</div>
		</div>
		{#each collections as collection, i}
			<div class="grid w-full py-4 border-t border-black border-opacity-[0.15] clickable" transition:slide|local on:click={() => goto('/collections/' + collection.slug)}>
				<div class="grid grid-cols-[1.5fr_7fr_1.5fr_3fr_2fr_3fr] w-[95%] place-items-center">
					<div class="text-center text-sm grid place-items-center">{i + 1}</div>
					<div class="flex place-items-center gap-6 place-self-start">
						<div class="w-12 h-12 background profile-pic bg-cover rounded-full" style="--url: url({collection.logoImageUrl})" />
						<div class="flex font-semibold text-sm gap-2">
							{collection.name}
							{#if collection.verified}
								<VerifiedBadge />
							{/if}
						</div>
					</div>
					<div class="flex place-items-center gap-2 text-sm">
						<Eth />
						{seperateNumberWithCommas(Math.round((collection.floorPrice ?? 0 + Number.EPSILON) * 100) / 100)}
					</div>
					<div class="flex place-items-center gap-2 text-sm">
						<Eth />
						{seperateNumberWithCommas(Math.round((collection.totalVol ?? 0 + Number.EPSILON) * 100) / 100)}
					</div>
					<div class="flex place-items-center gap-2 text-sm">
						<Eth />
						{seperateNumberWithCommas(Math.round((collection.total24hours ?? 0 + Number.EPSILON) * 100) / 100)}
					</div>
					<div class="flex place-items-center text-sm text-color-green" class:text-color-red={collection['24hourPercent'] < 0}>
						{(Math.round((collection['24hourPercent'] ?? 0 + Number.EPSILON) * 100) / 100).toLocaleString()}%
						<div class:rotate-180={collection['24hourPercent'] >= 0}>
							<ArrowDown />
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

{#if isLoading}
	<DiamondsLoader />
{:else}
	<div use:inview={inviewOptions} on:change={onChange} />
{/if}

<style lang="postcss">
	.profile-pic {
		background-image: var(--url);
	}
</style>
