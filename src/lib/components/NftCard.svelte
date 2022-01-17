<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Heart from '$icons/heart.svelte';
	import ThreeDots from '$icons/three-dots.svelte';
	import { fade } from 'svelte/transition';

	export let data: NftData;
	export let tokenData: TokenData;

	let dotsOpened = false;
	let imgLoaded = false;

	$: tokenName = tokenData.name.match(/(.+)\s\(?/)?.[1];
	$: collectionName = tokenData.name.match(/\(.+\)/g)?.[0].replace(/\(|\)/g, '');

	const toggleDots = () => (dotsOpened = !dotsOpened);
</script>

<div class="rounded-2xl overflow-hidden border p-4 relative" in:fade>
	<div class="flex items-center gap-x-2">
		<!-- Remove && false to show options -->
		{#if data?.ownedByUser && false}
			<button on:click={toggleDots}>
				<ThreeDots />
			</button>
		{/if}

		<div class="flex-grow" />

		<Heart />
		<div class="font-medium">{data?.likes || 0}</div>
	</div>

	<div
		class="transition w-full h-[18.5rem] mx-auto bg-gray-100 rounded-2xl overflow-hidden mt-2"
		class:animate-pulse={!imgLoaded}
	>
		<img
			src={tokenData?.image}
			alt=""
			class="object-cover transition w-full h-full"
			class:opacity-0={!imgLoaded}
			on:load={() => (imgLoaded = true)}
		/>
	</div>

	<div class="flex text-sm font-medium text-gray-600 mt-2">
		<div class="flex-grow">{collectionName || 'N/A'}</div>
		<div>Price</div>
	</div>

	<div class="flex font-semibold mt-2 items-center">
		<div class="flex-grow">{tokenName}</div>
		<Eth />
		<div class="ml-1">{tokenData?.price || 'N/A'}</div>
	</div>

	{#if dotsOpened && data?.ownedByUser}
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
