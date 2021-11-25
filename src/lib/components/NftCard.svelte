<script lang="ts">
	import type { NftData } from '$lib/data/nft';

	import Eth from '$lib/icons/eth.icon.svelte';
	import Heart from '$lib/icons/heart.icon.svelte';

	export let data: NftData;
</script>

<div class="rounded-2xl overflow-hidden border p-4">
	<div class="flex items-center gap-x-2 justify-end">
		<Heart />
		<div>{data.likes}</div>
	</div>

	<img src={data.img} alt="" class="mx-auto w-48 h-48 object-cover rounded-lg mt-2" />

	<div class="flex text-sm font-normal text-gray-600 mt-2">
		<div class="flex-grow">{data.collectionName}</div>
		<div>Price</div>
	</div>

	<div class="flex font-semibold mt-2 items-center">
		<div class="flex-grow">{data.name}</div>
		<Eth />
		<div class="ml-1">{data.priceEth}</div>
	</div>
</div>
