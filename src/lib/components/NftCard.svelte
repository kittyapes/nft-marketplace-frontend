<script lang="ts">
	import type { NftData } from '$lib/data/nft';
	import Eth from '$lib/icons/eth.icon.svelte';
	import Heart from '$lib/icons/heart.icon.svelte';
	import ThreeDots from '$lib/icons/three-dots.svelte';

	export let data: NftData;

	let dotsOpened = false;

	const toggleDots = () => (dotsOpened = !dotsOpened);
</script>

<div class="rounded-2xl overflow-hidden border p-4 relative">
	<div class="flex items-center gap-x-2">
		{#if data.ownedByUser}
			<button on:click={toggleDots}>
				<ThreeDots />
			</button>
		{/if}

		<div class="flex-grow" />

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

	{#if dotsOpened && data.ownedByUser}
		<div id="popup" class="flex flex-col absolute bg-white font-bold rounded-md top-10">
			<button class="gradient-text transition-btn">TRANSFER</button>
			<button class="transition-btn">HIDE</button>
		</div>
	{/if}
</div>

<style>
	#popup {
		@apply px-3 py-3 space-y-2;
		filter: drop-shadow(0px 4px 20px rgba(136, 136, 136, 0.25));
	}

	#popup > button {
		@apply text-left font-bold;
	}
</style>
