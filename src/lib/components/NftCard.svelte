<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Heart from '$icons/heart.svelte';
	import ThreeDots from '$icons/three-dots.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { addUrlParam } from '$utils/misc/addUrlParam';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';
	import { favoriteNft } from '$utils/nfts/favoriteNft';
	import { setPopup } from '$utils/popup';
	import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
	import { fade } from 'svelte/transition';
	import getTimeRemaining from '$utils/timeRemaining';
	import { onMount } from 'svelte';
	import { likedNfts, refreshLikedNfts } from '$stores/user';
	import { walletConnected } from '$utils/wallet';
	import WalletNotConnectedPopup from '$lib/components/WalletNotConnectedPopup.svelte';
	import { notifyError, notifySuccess } from '$utils/toast';
	import dayjs from 'dayjs';
	import { noTryAsync } from 'no-try';

	export let options: NftCardOptions;

	$: likes = options?.likes;
	let dotsOpened = false;
	let imgLoaded = false;

	const toggleDots = () => (dotsOpened = !dotsOpened);

	function handleClick() {
		addUrlParam('id', options.id);
		setPopup(options.popupComponent, { props: { options: { ...options.popupOptions, favorited: options.favorited } }, onClose: () => removeUrlParam('id') });
	}

	async function favNFT() {
		if (!$walletConnected) {
			setPopup(WalletNotConnectedPopup, {
				unique: true
			});
		}
		if (!$currentUserAddress || !options.popupOptions) return;

		for (const id of options.likeIds) {
			const [err, res] = await noTryAsync(() => favoriteNft(id));
			if (err) {
				notifyError(err.message);
				console.error(err);
			} else if (res.data.message) {
				$likedNfts = [options.likeIds, -1];
				options.favorited = true;
				notifySuccess('Unliked NFT.');
			} else {
				$likedNfts = [options.likeIds, 1];
				options.favorited = true;
				notifySuccess('Liked NFT.');
			}
		}

		await refreshLikedNfts($currentUserAddress);
	}

	let time = new Date();
	let interval = null;

	onMount(() => {
		if (options.popupOptions?.startTime && options.popupOptions?.isListingTimeActive) {
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
		if (_time && options.popupOptions?.startTime && options.popupOptions?.isListingTimeActive) {
			const startTime = new Date(options.popupOptions.startTime);
			const endTime = new Date(startTime.getTime() + (options.popupOptions.duration ?? 0));
			saleHasStarted = options.popupOptions.isListingTimeActive && startTime.getTime() < Date.now();

			timeRemainingToSaleStart = getTimeRemaining(startTime.toISOString(), new Date().toISOString());

			timeRemainingToSaleEnd = getTimeRemaining(endTime.toISOString(), new Date(Date.now()).toISOString());

			if (!options.popupOptions?.startTime && !options.popupOptions?.isListingTimeActive && timeRemainingToSaleStart.total < 0 && timeRemainingToSaleEnd.total < 0 && interval) {
				clearInterval(interval);
			}
		}
	})(time);
</script>

<!-- Added a maximum width to prevent the card from extending its bounds when its only one card  -->
<div class="relative p-4 overflow-hidden border border-color-gray-base border-opacity-50 rounded-2xl max-w-[246px]" in:fade on:click={handleClick} class:cursor-pointer={options?.popupOptions}>
	<div class="flex items-center gap-x-2">
		<!-- Listing Timer If The Time has not Expired Yet or Listing isn't live -->
		{#if options.popupOptions?.startTime}
			{#if options.popupOptions?.isListingTimeActive}
				<div class="listing-timer text-[10px] font-bold uppercase">
					{#if !saleHasStarted && timeRemainingToSaleStart.total > 0}
						<span class="text-transparent bg-gradient-to-r bg-clip-text from-color-purple to-color-blue">Starting In:</span>
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
						<div class="listing-timer text-[10px] font-bold uppercase text-color-red">Expired</div>
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

		<div class="text-white btn" class:text-color-red={options?.favorited} on:click|stopPropagation={favNFT}>
			<Heart class="w-6 h-6" />
		</div>
		<!-- TODO Likes -->
		<div class="font-medium select-none">{(options && likes === 0) || likes ? likes : 'N/A'}</div>
	</div>

	<div class="w-full mx-auto mt-2 overflow-hidden transition bg-gray-100 rounded-lg select-none aspect-1" class:animate-pulse={!imgLoaded}>
		<img alt="" src={options?.imageUrl} class="object-cover object-top w-full h-full transition" class:opacity-0={!imgLoaded} on:load={() => (imgLoaded = true)} />
	</div>

	<div class="flex mt-2 text-sm font-medium text-gray-600">
		<!-- TODO REMOVE THE N/As - left the color red to indicate that this is a problem that needs fixing -->
		<!-- Need server to return collection names -->
		<div class={`flex-grow ${(options?.collectionName === 'N/A' || options?.collectionName) && 'text-red-400'}`}>{options?.collectionName || 'N/A'}</div>
		<!-- Hide price info when not present/listed -->
		{#if options?.price}
			<div>Price</div>
		{/if}
	</div>

	<div class="flex items-center mt-2 font-semibold">
		<div class="flex-grow whitespace-nowrap">{options?.title || 'N/A'}</div>
		<!-- Hide price info when not present/listed -->
		{#if options?.price}
			<Eth />
			<div class="ml-1">{options?.price || 'N/A'}</div>
		{/if}
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
