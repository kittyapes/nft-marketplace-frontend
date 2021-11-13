<script lang="ts">
	import Eth from '$lib/icons/eth.icon.svelte';
	import Heart from '$lib/icons/heart.icon.svelte';

	export let title: string;
	export let collection: string;
	export let img: string;
	export let likeCount: number;
	export let price: number;
</script>

<div class="w-56 rounded-2xl overflow-hidden border p-4">
	<div class="flex items-center gap-x-2 justify-end">
		<Heart />
		<div>{likeCount}</div>
	</div>

	<img src={img} alt="" class="w-48 h-48 object-cover rounded-lg mt-2" />

	<div class="flex text-sm font-normal text-gray-600 mt-2">
		<div class="flex-grow">{collection}</div>
		<div>Price</div>
	</div>

	<div class="flex font-semibold mt-2 items-center">
		<div class="flex-grow">{title}</div>
		<Eth />
		<div class="ml-1">{price}</div>
	</div>
</div>
