<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { CardOptions } from '$interfaces/ui';

	export let options: CardOptions;
	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';
	const nft = options?.nfts?.[0];
</script>

<div class="flex flex-col">
	<!-- <div class={gridStyle === 'normal' ? 'h-80 2xl:h-[400px]' : 'h-52 2xl:h-64'}> -->
	<div>
		<img src={nft?.thumbnailUrl} alt={nft?.name} />
	</div>
	<div class:normal-card={gridStyle === 'normal'} class:dense-card={gridStyle === 'dense'} class:hidden={gridStyle === 'masonry'} class="bg-dark-gradient w-full">
		<h4 class="text-gradient font-bold {gridStyle === 'normal' ? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7' : 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}">
			{nft?.collectionData?.name}
		</h4>
		<h3 class="text-white font-semibold {gridStyle === 'normal' ? 'text-base 2xl:text-xl leading-6 2xl:leading-7' : 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}">{nft?.name}</h3>
		<div class="flex flex-row items-center justify-between mt-2.5 ">
			<div class="flex flex-col items-start">
				<h4 class="text-gradient font-bold {gridStyle === 'normal' ? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7' : 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}">Highest Bid</h4>
				<div class="flex flex-row items-center {gridStyle === 'normal' ? 'gap-x-1' : 'gap-x-0.5'}">
					<span><Eth class={gridStyle === 'normal' ? 'w-2.5 2xl:w-3 h-3.5 2xl:h-4' : 'w-1.5 2xl:w-2 h-2.5 2xl:h-3'} /></span>
					<h3 class="text-white font-semibold {gridStyle === 'normal' ? 'text-base 2xl:text-xl leading-6 2xl:leading-7' : 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}">84</h3>
				</div>
			</div>
			<div class="flex flex-col items-end">
				<h4 class="text-gradient font-bold {gridStyle === 'normal' ? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7' : 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}">Ends In</h4>
				<h3 class="text-white font-semibold {gridStyle === 'normal' ? 'text-base 2xl:text-xl leading-6 2xl:leading-7' : 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}">18h 05m 46s</h3>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.normal-card {
		@apply py-2.5 2xl:py-3 px-4 2xl:px-5;
	}
	.dense-card {
		@apply py-1.5 px-2.5;
	}
</style>
