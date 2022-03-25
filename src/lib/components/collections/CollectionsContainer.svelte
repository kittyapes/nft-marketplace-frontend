<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { CollectionData } from 'src/interfaces/collectionData';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { seperateNumberWithCommas } from '$utils/misc/seperateNumberWithSeparators';
	import Dropdown from '../Dropdown.svelte';
	import { slide } from 'svelte/transition';

	export let collections: CollectionData[];
	export let viewCollectionsCount = 10;

	let displayCollections = [...collections].slice(0, viewCollectionsCount);
	let currentCollectionsCount = viewCollectionsCount;
	let options = [
		{
			label: 'HIGHEST TOTAL VOL'
		},
		{
			label: 'HIGHEST 24H VOL'
		},
		{
			label: 'HIGHEST 24H VOL %'
		},
		{
			label: 'HIGHEST FLOOR'
		}
	];
	let selection: 'ALL' | 'VERIFIED' = 'ALL';

	let filter = (status: string) => {
		displayCollections = [...collections].slice(0, currentCollectionsCount);
		if (status === 'VERIFIED') {
			displayCollections = [...displayCollections].filter((e) => e.verfified);
			selection = 'VERIFIED';
		} else {
			selection = 'ALL';
		}
	};

	let changeView = (change: 'less' | 'more') => {
		if (change === 'less') {
			currentCollectionsCount -= viewCollectionsCount;
		} else {
			if (currentCollectionsCount + viewCollectionsCount >= collections.length) {
				currentCollectionsCount = collections.length;
			} else {
				currentCollectionsCount += viewCollectionsCount;
			}
		}
		filter(selection);
	};

	let handleSelect = (event?: CustomEvent) => {
		if (!event) {
			collections.sort((a, b) => b.totalVolume - a.totalVolume);
			displayCollections.sort((a, b) => b.totalVolume - a.totalVolume);
			displayCollections = displayCollections;
			return;
		}
		if (event.detail.label === 'HIGHEST 24H VOL %') {
			collections.sort((a, b) => b.dailyGrowth - a.dailyGrowth);
			displayCollections.sort((a, b) => b.dailyGrowth - a.dailyGrowth);
		} else if (event.detail.label === 'HIGHEST 24H VOL') {
			collections.sort((a, b) => b.dailyVolume - a.dailyVolume);
			displayCollections.sort((a, b) => b.dailyVolume - a.dailyVolume);
		} else if (event.detail.label === 'HIGHEST TOTAL VOL') {
			collections.sort((a, b) => b.totalVolume - a.totalVolume);
			displayCollections.sort((a, b) => b.totalVolume - a.totalVolume);
		} else if (event.detail.label === 'HIGHEST FLOOR') {
			collections.sort((a, b) => b.floor - a.floor);
			displayCollections.sort((a, b) => b.floor - a.floor);
		}
		displayCollections = displayCollections;
	};

	handleSelect();
</script>

<div class="w-full flex flex-col gap-10">
	<div class="flex font-semibold text-xs gap-0 w-full">
		<button
			class="uppercase btn w-28 h-12 transition-colors bg-color-gray-lighter text-color-gray-base"
			class:btn-gradient={selection === 'ALL'}
			on:click={() => filter('ALL')}
		>
			all
		</button>
		<button
			class="uppercase btn w-28 h-12 bg-color-gray-lighter text-color-gray-base transition-colors"
			class:btn-gradient={selection === 'VERIFIED'}
			on:click={() => filter('VERIFIED')}
		>
			verified
		</button>
		<div class="flex-grow" />
		<Dropdown {options} on:select={handleSelect} class="w-40 bg-color-gray-lighter" />
	</div>
	<div class="bg-color-gray-lighter w-full flex flex-col">
		<div
			class="grid w-[95%] grid-cols-[8.5fr_1.5fr_3fr_2fr_3fr] text-center text-xs text-color-gray-base py-5 font-bold"
		>
			<div />
			<div class="uppercase">Floor</div>
			<div class="uppercase">Total vol</div>
			<div class="uppercase">24h vol</div>
			<div class="uppercase">24h vol %</div>
		</div>
		{#each displayCollections as collection, i}
			<div class="grid w-full py-4 border-t border-black border-opacity-[0.15]" transition:slide>
				<div class="grid grid-cols-[1.5fr_7fr_1.5fr_3fr_2fr_3fr] w-[95%] place-items-center">
					<div class="text-center text-sm grid place-items-center">{i + 1}</div>
					<div class="flex place-items-center gap-6 place-self-start">
						<div
							class="w-12 h-12 background profile-pic bg-cover rounded-full"
							style="--url: url({collection.imageUrl})"
						/>
						<div class="flex font-semibold text-sm gap-2">
							{collection.name}
							{#if collection.verfified}
								<VerifiedBadge />
							{/if}
						</div>
					</div>
					<div class="flex place-items-center gap-2 text-sm">
						<Eth />
						{seperateNumberWithCommas(Math.round((collection.floor + Number.EPSILON) * 100) / 100)}
					</div>
					<div class="flex place-items-center gap-2 text-sm">
						<Eth />
						{seperateNumberWithCommas(
							Math.round((collection.totalVolume + Number.EPSILON) * 100) / 100
						)}
					</div>
					<div class="flex place-items-center gap-2 text-sm">
						<Eth />
						{seperateNumberWithCommas(
							Math.round((collection.dailyVolume + Number.EPSILON) * 100) / 100
						)}
					</div>
					<div
						class="flex place-items-center text-sm text-color-green"
						class:text-color-red={collection.dailyGrowth < 0}
					>
						{(Math.round((collection.dailyGrowth + Number.EPSILON) * 100) / 100).toLocaleString()}%
						<div class:rotate-180={collection.dailyGrowth >= 0}>
							<ArrowDown />
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
	<div class="w-full grid place-items-center">
		<button class="btn">
			{#if displayCollections.length === collections.length || (selection === 'VERIFIED' && displayCollections.length === collections.filter((e) => e.verfified).length)}
				<span
					class="font-bold underline underline-offset-2 uppercase"
					on:click={() => changeView('less')}
				>
					view less
				</span>
			{:else}
				<span
					class="font-bold underline underline-offset-2 uppercase"
					on:click={() => changeView('more')}
				>
					view more
				</span>
			{/if}
		</button>
	</div>
</div>

<style lang="postcss">
	.profile-pic {
		background-image: var(--url);
	}
</style>
