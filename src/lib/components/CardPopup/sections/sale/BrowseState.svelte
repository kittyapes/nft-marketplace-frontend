<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import { getIconUrl } from '$utils/misc/getIconUrl';

	export let options: CardPopupOptions;
</script>

<div class="flex flex-col justify-center h-[90%]">
	<img class="h-24" src={getIconUrl('cart')} alt="" />

	<div class="opacity-70 font-bold text-2xl text-center">Buy the NFT</div>
	<div class="opacity-50 text-center mt-4">Click buy now button to own this NFT</div>

	<div class="font-bold opacity-50 text-center mt-8">Price:</div>
	<div class="flex items-center justify-center mt-2">
		<img src={getIconUrl('eth')} alt="" />
		<div class="text-5xl font-bold">{options.saleData?.price || 'N/A'}</div>
		<div class="font-bold opacity-70 h-full grid place-items-end ml-2">ETH</div>
	</div>

	<div class="grid place-items-center mt-12">
		<button class="btn btn-gradient rounded-full h-16 w-80 uppercase font-bold text-xl">Buy Now</button>
	</div>
</div>
