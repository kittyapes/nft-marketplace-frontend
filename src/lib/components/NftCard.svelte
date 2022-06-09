<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Heart from '$icons/heart.svelte';
	import ThreeDots from '$icons/three-dots.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { createMintedNFTOnAPI, createNFTOnAPI } from '$utils/create/createNFT';
	import { addUrlParam } from '$utils/misc/addUrlParam';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';
	import { favoriteNft } from '$utils/nfts/favoriteNft';
	import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
	import { getUsersThatFavoritedNft } from '$utils/nfts/getUsersThatFavoritedNft';
	import { setPopup } from '$utils/popup';
	import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
	import { fade } from 'svelte/transition';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import getTimeRemaining from '$utils/timeRemaining';
	import { onMount } from 'svelte';

	dayjs.extend(relativeTime);

	export let options: NftCardOptions;

	let likes = options?.likes;
	let dotsOpened = false;
	let imgLoaded = false;

	const toggleDots = () => (dotsOpened = !dotsOpened);

	function handleClick() {
		if (!options.getPopupProps) return;

		addUrlParam('id', options.id);
		options.getPopupProps().then((props) => {
			console.log(props);
			setPopup(options.popupComponent, { props, onClose: () => removeUrlParam('id') });
		});
	}

	async function favNFT() {
		if (!$currentUserAddress || !options.getPopupProps) return;
		options.favorite ? (likes = likes - 1) : (likes = likes + 1);
		// change status first for quick feedback
		options.favorite = !options.favorite;

		const favouriteNftRes = await favoriteNft(options.id);
	}

	let time = new Date();
	let interval = null;

	onMount(() => {
		if (options.startTime && options.isTimeActive) {
			// Update every minute
			interval = setInterval(() => {
				time = new Date(Date.now());
			}, 60000);
		}
		return () => {
			clearInterval(interval);
		};
	});

	$: saleHasStarted = false;

	$: timeRemainingToSaleStart = null;
	$: timeRemainingToSaleEnd = null;

	$: ((_time) => {
		if (_time && options.startTime && options.isTimeActive) {
			saleHasStarted = options.isTimeActive && options.startTime.getTime() < Date.now();

			timeRemainingToSaleStart = getTimeRemaining(options.startTime.toISOString(), new Date().toISOString());
			timeRemainingToSaleEnd = getTimeRemaining(new Date().toISOString(), options.startTime.toISOString());

			if (!options.startTime && !options.isTimeActive && timeRemainingToSaleStart.total < 0 && timeRemainingToSaleEnd.total < 0 && interval) {
				clearInterval(interval);
			}
		}
	})(time);
</script>

<!-- Added a maximum width to prevent the card from extending its bounds when its only one card  -->
<div class="relative p-4 overflow-hidden border rounded-2xl max-w-[246px]" in:fade on:click={handleClick} class:cursor-pointer={options?.getPopupProps}>
	<div class="flex items-center gap-x-2">
		<!-- Listing Timer If The Time has not Expired Yet or Listing isn't live -->
		{#if options.startTime}
			{#if options.isTimeActive}
				<div class="listing-timer text-[10px] font-bold uppercase">
					{#if !saleHasStarted && timeRemainingToSaleStart.total > 0}
						<span class="bg-gradient-to-r bg-clip-text from-color-purple to-color-blue text-transparent">Starting In:</span>
						{#if timeRemainingToSaleStart.days > 0}
							{timeRemainingToSaleStart.days}D
						{/if}
						{#if timeRemainingToSaleStart.hours > 0}
							{timeRemainingToSaleStart.hours}H
						{/if}
						{timeRemainingToSaleStart.minutes}MIN
					{:else if timeRemainingToSaleEnd.total > 0}
						<span class="text-color-red">Ending In:</span>
						{#if timeRemainingToSaleEnd.days > 0}
							{timeRemainingToSaleEnd.days}D
						{/if}
						{#if timeRemainingToSaleEnd.hours > 0}
							{timeRemainingToSaleEnd.hours}H
						{/if}
						{timeRemainingToSaleEnd.minutes}MIN
					{:else}
						LIVE!
					{/if}
				</div>
			{:else}
				<div class="listing-timer text-[10px] font-bold uppercase text-color-red">Expired</div>
			{/if}
		{/if}

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

	<div class="w-full mx-auto mt-2 overflow-hidden transition bg-gray-100 rounded-lg aspect-1 select-none" class:animate-pulse={!imgLoaded}>
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
