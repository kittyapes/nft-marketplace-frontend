<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { Collection } from '$utils/api/collection';
	export let collectionData: Collection;
</script>

<div class="flex flex-row items-center text-base leading-6">
	<div class="hover:bg-main-gradient flex flex-col items-center justify-center border-gradient border-r-0 w-[106px] 2xl:w-[132px] h-[86px] 2xl:h-[106px]">
		<p class="text-xs 2xl:text-base leading-5 2xl:leading-6">Highest Sale</p>
		<div class="flex items-center gap-x-1.5">
			<Eth class="w-2.5 h-4" />
			<span class="text-[14px] 2xl:text-[18px] leading-5 2xl:leading-6">{collectionData?.highestSale || 0.0}</span>
		</div>
	</div>
	<div class="hover:bg-main-gradient flex flex-col items-center justify-center border-gradient border-r-0 w-[106px] 2xl:w-[132px] h-[86px] 2xl:h-[106px]">
		<p class="text-xs 2xl:text-base leading-5 2xl:leading-6">Floor Price</p>
		<div class="flex items-center gap-x-1.5">
			<Eth class="w-2.5 h-4" />
			<span class="text-[14px] 2xl:text-[18px] leading-5 2xl:leading-6">{collectionData?.floorPrice || 0.0}</span>
		</div>
	</div>
	<div class="hover:bg-main-gradient flex flex-col items-center justify-center border-gradient border-r-0 w-[106px] 2xl:w-[132px] h-[86px] 2xl:h-[106px]">
		<p class="text-xs 2xl:text-base leading-5 2xl:leading-6">Total Volume</p>
		<div class="flex items-center gap-x-1.5">
			<Eth class="w-2.5 h-4" />
			<span class="text-[14px] 2xl:text-[18px] leading-5 2xl:leading-6">{collectionData?.totalVol || 0.0}</span>
		</div>
	</div>
	<div class="hover:bg-main-gradient flex flex-col items-center justify-center border-gradient border-r-0 w-[106px] 2xl:w-[132px] h-[86px] 2xl:h-[106px]">
		<p class="text-xs 2xl:text-base leading-5 2xl:leading-6">Items</p>
		<div class="flex items-center gap-x-1.5">
			<span class="text-[14px] 2xl:text-[18px] leading-5 2xl:leading-6">{collectionData?.items || 0.0}</span>
		</div>
	</div>
	<div class="hover:bg-main-gradient flex flex-col items-center justify-center border-gradient border-r-0 w-[106px] 2xl:w-[132px] h-[86px] 2xl:h-[106px]">
		<p class="text-xs 2xl:text-base leading-5 2xl:leading-6">Owners</p>
		<div class="flex items-center gap-x-1.5">
			<span class="text-[14px] 2xl:text-[18px] leading-5 2xl:leading-6">{collectionData?.owners || 0.0}</span>
		</div>
	</div>
	<div class="hover:bg-main-gradient flex flex-col items-center justify-center border-gradient hover: w-[106px] 2xl:w-[132px] h-[86px] 2xl:h-[106px]">
		<p class="text-xs 2xl:text-base leading-5 2xl:leading-6">24hr Volume</p>
		<div class="flex items-center gap-x-1.5">
			<Eth class="w-2.5 h-4" />
			<span class="text-[14px] 2xl:text-[18px] leading-5 2xl:leading-6">{collectionData?.total24hours || 0.0}</span>
		</div>
	</div>
</div>
