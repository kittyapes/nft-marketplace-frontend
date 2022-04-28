<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Heart from '$icons/heart.svelte';
	import ThreeDots from '$icons/three-dots.svelte';
	import { setPopup } from '$utils/popup';
	import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
	import { fade } from 'svelte/transition';
	import NftDisplayPopup from './profile/NFTDisplayPopup.svelte';

	export let options: NftCardOptions;

	let dotsOpened = false;
	let imgLoaded = false;

	const toggleDots = () => (dotsOpened = !dotsOpened);

	function handleClick() {
		options.getUniversalPopupOptions().then((universalPopupOptions) => {
			setPopup(NftDisplayPopup, { props: { options: universalPopupOptions } });
		});
	}
</script>

<div class="rounded-2xl overflow-hidden border p-4 relative cursor-pointer" in:fade on:click={handleClick}>
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
		<div class="font-medium select-none">{options?.likes || 0}</div>
	</div>

	<div class="transition w-full aspect-1 mx-auto bg-gray-100 rounded-lg overflow-hidden mt-2" class:animate-pulse={!imgLoaded}>
		<img alt="" src={options?.imageUrl} class="object-cover object-top transition w-full h-full" class:opacity-0={!imgLoaded} on:load={() => (imgLoaded = true)} />
	</div>

	<div class="flex text-sm font-medium text-gray-600 mt-2">
		<div class="flex-grow">{options?.collectionName || 'N/A'}</div>
		<div>Price</div>
	</div>

	<div class="flex font-semibold mt-2 items-center">
		<div class="flex-grow">{options?.title || 'N/A'}</div>
		<Eth />
		<div class="ml-1">{options?.price || 'N/A'}</div>
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
