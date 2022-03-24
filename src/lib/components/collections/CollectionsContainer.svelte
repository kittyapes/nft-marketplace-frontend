<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { CollectionData } from 'src/interfaces/collectionData';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { seperateNumberWithCommas } from '$utils/misc/seperateNumberWithSeparators';
	import Dropdown from '../Dropdown.svelte';

	export let collections: CollectionData[];

	$: verifiedCollections = collections.filter((e) => e.verfified);
	let displayCollections = [...collections];

	let options = [
		{
			label: 'HIGHEST 24H VOL'
		},
		{
			label: 'HIGHEST 24H VOL %'
		},
		{
			label: 'HIGHEST TOTAL VOL'
		},
		{
			label: 'HIGHEST FLOOR'
		}
	];
	let selection: 'ALL' | 'VERIFIED' = 'ALL';

	let filter = () => {
		if (selection === 'VERIFIED') {
			displayCollections = [...collections];
			displayCollections = displayCollections;
		} else {
			displayCollections = [...verifiedCollections];
			displayCollections = displayCollections;
		}
	};
</script>

<div class="w-full flex flex-col gap-10">
	<div class="flex font-semibold text-xs gap-0 w-full">
		{#if selection === 'ALL'}
			<button class="uppercase btn btn-gradient w-28 h-12">all</button>
			<button
				class="uppercase btn bg-color-gray-lighter w-28 h-12 text-color-gray-base"
				on:click={filter}
			>
				verified
			</button>
		{:else}
			<button
				class="uppercase btn bg-color-gray-lighter w-28 h-12 text-color-gray-base"
				on:click={filter}
			>
				all
			</button>
			<button class="uppercase btn btn-gradient w-28 h-12">verified</button>
		{/if}
		<div class="flex-grow" />
		<Dropdown {options} class="w-40 bg-color-gray-lighter" />
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
			<div class="grid w-full py-4 border-t border-black border-opacity-[0.15]">
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
						<div class:rotate-180={collection.dailyGrowth < 0}>
							<ArrowDown />
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.profile-pic {
		background-image: var(--url);
	}
</style>
