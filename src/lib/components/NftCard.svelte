<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Heart from '$icons/heart.svelte';
	import ThreeDots from '$icons/three-dots.svelte';
	import { addUrlParam } from '$utils/misc/addUrlParam';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';
	import { setPopup } from '$utils/popup';
	import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
	import { fade } from 'svelte/transition';
	import NftDisplayPopup from './profile/NFTDisplayPopup.svelte';

	export let options: NftCardOptions;

	let dotsOpened = false;
	let imgLoaded = false;

	const toggleDots = () => (dotsOpened = !dotsOpened);

	function handleClick() {
		addUrlParam('id', options.id);
		console.log(options);
		options.getUniversalPopupOptions().then((universalPopupOptions) => {
			setPopup(NftDisplayPopup, {
				props: { options: universalPopupOptions },
				onClose: () => removeUrlParam('id')
			});
		});
	}
</script>

<div class="relative p-4 overflow-hidden border cursor-pointer rounded-2xl" in:fade on:click={handleClick}>
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

	<div class="w-full mx-auto mt-2 overflow-hidden transition bg-gray-100 rounded-lg aspect-1" class:animate-pulse={!imgLoaded}>
		<img alt="" src={options?.imageUrl} class="object-cover object-top w-full h-full transition" class:opacity-0={!imgLoaded} on:load={() => (imgLoaded = true)} />
	</div>

	<div class="flex mt-2 text-sm font-medium text-gray-600">
		<div class="flex-grow">{options?.collectionName || 'N/A'}</div>
		<div>Price</div>
	</div>

	<div class="flex items-center mt-2 font-semibold">
		<div class="flex-grow">{options?.title || 'N/A'}</div>
		<Eth />
		<div class="ml-1">{options?.price || 'N/A'}</div>
	</div>

	<!-- TODO If owned by user -->
	{#if dotsOpened && false}
		<div id="popup" class="absolute flex flex-col font-bold bg-white rounded-md top-10">
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
