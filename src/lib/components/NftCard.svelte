<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Heart from '$icons/heart.svelte';
	import ThreeDots from '$icons/three-dots.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { addUrlParam } from '$utils/misc/addUrlParam';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';
	import { favoriteNft } from '$utils/nfts/favoriteNft';
	import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
	import { setPopup } from '$utils/popup';
	import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import NftDisplayPopup from './profile/NFTDisplayPopup.svelte';

	export let options: NftCardOptions;

	let likes = options?.likes;
	let dotsOpened = false;
	let imgLoaded = false;

	const toggleDots = () => (dotsOpened = !dotsOpened);

	function handleClick() {
		if (!options.getUniversalPopupOptions) return;

		addUrlParam('id', options.id);
		options.getUniversalPopupOptions().then((universalPopupOptions) => {
			setPopup(NftDisplayPopup, {
				props: { options: universalPopupOptions },
				onClose: () => removeUrlParam('id')
			});
		});
	}

	async function favNFT() {
		console.log(options);
		if (!$currentUserAddress) return;
		options.favorite ? (likes = likes - 1) : (likes = likes + 1);

		options.favorite = !options.favorite;
		const res = await favoriteNft(options.id);
	}
</script>

<div class="relative p-4 overflow-hidden border rounded-2xl" in:fade on:click={handleClick} class:cursor-pointer={options?.getUniversalPopupOptions}>
	<div class="flex items-center gap-x-2">
		<!-- Remove && false to show options -->
		<!-- Owned by user -->
		{#if false}
			<button on:click={toggleDots}>
				<ThreeDots />
			</button>
		{/if}

		<div class="flex-grow" />

		<div class="btn text-white" class:text-color-red={options?.favorite} on:click|stopPropagation={favNFT}>
			<Heart class="w-6 h-6" />
		</div>
		<!-- TODO Likes -->
		<div class="font-medium select-none">{(options && likes === 0) || likes ? likes : 'N/A'}</div>
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
