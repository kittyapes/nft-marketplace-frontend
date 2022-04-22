<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Heart from '$icons/heart.svelte';
	import ThreeDots from '$icons/three-dots.svelte';
	import { fade } from 'svelte/transition';

	export let imageUrl = '';
	export let name = 'N/A';
	export let collectionName = 'N/A';
	export let likes = 0;
	export let price = 0;

	let dotsOpened = false;
	let imgLoaded = false;

	const toggleDots = () => (dotsOpened = !dotsOpened);
</script>

<div class="rounded-2xl overflow-hidden border p-4 relative cursor-pointer" in:fade on:click>
	<div class="flex items-center gap-x-2">
		<!-- Remove && false to show options -->
		<!-- Owned by user -->
		{#if false}
			<button on:click={toggleDots}>
				<ThreeDots />
			</button>
		{/if}

		<div class="flex-grow" />

		<Heart />
		<!-- TODO Likes -->
		<div class="font-medium select-none">{likes}</div>
	</div>

	<div class="transition w-full aspect-1 mx-auto bg-gray-100 rounded-lg overflow-hidden mt-2" class:animate-pulse={!imgLoaded}>
		<!-- src={$tokenUriData?.image || tokenData.metadata?.image} -->
		<img alt="" src={imageUrl} class="object-cover object-top transition w-full h-full" class:opacity-0={!imgLoaded} on:load={() => (imgLoaded = true)} />
	</div>

	<div class="flex text-sm font-medium text-gray-600 mt-2">
		<!-- <div class="flex-grow">{tokenData?.name || 'N/A'}</div> -->
		<div class="flex-grow">{collectionName}</div>
		<div>Price</div>
	</div>

	<div class="flex font-semibold mt-2 items-center">
		<!-- <div class="flex-grow">{tokenData?.metadata?.name || $tokenUriData?.name || 'N/A'}</div> -->
		<div class="flex-grow">{name}</div>
		<Eth />
		<div class="ml-1">{price}</div>
	</div>

	<!-- TODO If owned by user -->
	{#if dotsOpened && false}
		<div id="popup" class="flex flex-col absolute bg-white font-bold rounded-md top-10">
			<button class="gradient-text transition-btn">TRANSFER</button>
			<button class="transition-btn">HIDE</button>
		</div>
	{/if}
</div>

<style type="postcss">
	#popup {
		@apply px-3 py-3 space-y-2;
		filter: drop-shadow(0px 4px 20px rgba(136, 136, 136, 0.25));
	}

	#popup > button {
		@apply text-left font-bold;
	}
</style>
