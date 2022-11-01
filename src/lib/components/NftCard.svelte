<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Heart from '$icons/heart.svelte';
	import ThreeDots from '$icons/three-dots.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import WalletNotConnectedPopup from '$lib/components/WalletNotConnectedPopup.svelte';
	import { likedNftIds, refreshLikedNfts } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { apiGetCollectionBySlug } from '$utils/api/collection';
	import { apiHideNft, apiRevealNft } from '$utils/api/nft';
	import { sanitizeHtmlInternal } from '$utils/html';
	import { makeHttps } from '$utils/ipfs';
	import { addUrlParam } from '$utils/misc/addUrlParam';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';
	import { getListingCardTimerHtml } from '$utils/misc/time';
	import { favoriteNft } from '$utils/nfts/favoriteNft';
	import { setPopup, updatePopupProps } from '$utils/popup';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { walletConnected } from '$utils/wallet';
	import { noTryAsync } from 'no-try';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import CardPopup from './CardPopup/CardPopup.svelte';
	import { reject } from 'lodash-es';
	import Loader from '$icons/loader.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;
	export let menuItems: ('hide' | 'reveal' | 'transfer')[] = [];
	export let hideLikes = false;

	// Helpers
	let imgLoaded = false;

	// Menu
	let dotsOpened = false;

	const toggleDots = (ev: Event) => {
		dotsOpened = !dotsOpened;
		ev.stopPropagation();
	};

	// Universal Popup
	async function handleClick(ev) {
		if (!options.allowPopup) return;

		const id = options.resourceType === 'nft' ? options.nfts[0].databaseId : options.listingData.onChainId;

		addUrlParam('id', id);

		const popupHandler = setPopup(CardPopup, { props: { options }, onClose: () => removeUrlParam('id') });

		// Load complete collection data after opening the popup
		if (options.nfts[0].collectionData.slug) {
			const collectionData = await apiGetCollectionBySlug(options.nfts[0].collectionData.slug);

			// Replace partial collection data with complete collection data fetched from API
			if (collectionData) options.nfts[0].collectionData = collectionData;
			updatePopupProps(popupHandler?.id, { options });
		}
	}

	// Favoriting
	$: isUserLiked = $likedNftIds.includes(options.nfts[0].onChainId);

	async function favNFT() {
		if (!$walletConnected) {
			setPopup(WalletNotConnectedPopup, { unique: true });
			return;
		}

		const [err, res] = await noTryAsync(() => favoriteNft(options.nfts[0].databaseId));

		if (err) {
			notifyError(err.message);
			console.error(err);
		} else if (res.data.message) {
			notifySuccess('Unfavorited NFT.');
			options.nfts[0].likes--;
		} else {
			notifySuccess('Favorited NFT.');
			options.nfts[0].likes++;
		}

		await refreshLikedNfts($currentUserAddress);
	}

	// Hiding
	async function hideNft(ev: Event) {
		dotsOpened = false;
		ev.stopPropagation();

		const res = await apiHideNft(options.nfts[0].databaseId);

		if (res.err) {
			notifyError('Failed to hide NFT. \n' + res.err.message);
		} else {
			dispatch('hide-me');
		}
	}

	async function revealNft(ev: Event) {
		dotsOpened = false;
		ev.stopPropagation();

		const res = await apiRevealNft(options.nfts[0].databaseId);

		if (res.err) {
			notifyError('Failed to reveal NFT. \n' + res.err.message);
		} else {
			dispatch('hide-me');
		}
	}

	// Listing timer
	let timerHtml: string = '';
	let timerInterval;
	let fileType;

	function updateTimerHtml() {
		timerHtml = sanitizeHtmlInternal(getListingCardTimerHtml(options.listingData.startTime, options.listingData.duration));
	}

	const preload = async (src) => {
		const resp = await fetch(makeHttps(src));
		const blob = await resp.blob();
		fileType = blob.type.split('/')[0];

		return new Promise(function (resolve) {
			let reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = () => {
				imgLoaded = true;
				resolve(reader.result);
			};
			reader.onerror = (error) => {
				imgLoaded = false;
				reject(`Error: ${error}`);
			};
		});
	};

	onMount(() => {
		if (options.resourceType !== 'listing') return;

		timerInterval = setInterval(updateTimerHtml, 15_000);
		updateTimerHtml();
	});

	onDestroy(() => clearInterval(timerInterval));
</script>

<div class="relative p-4 overflow-hidden border border-color-gray-base border-opacity-50 rounded-2xl max-w-[246px]" in:fade on:click={handleClick} class:cursor-pointer={options.allowPopup}>
	<div class="flex items-center h-8 gap-x-2">
		<div class="font-bold text-[10px] uppercase">
			{@html timerHtml}
		</div>

		<!-- Owned by user -->
		{#if menuItems?.length}
			<button on:click={toggleDots} class="w-8 h-8 hover:opacity-50" transition:fade|local={{ duration: 150 }}>
				<ThreeDots />
			</button>
		{/if}

		<div class="flex-grow" />

		{#if !hideLikes}
			<div class="text-white btn" class:text-color-red={isUserLiked} on:click|stopPropagation={favNFT}>
				<Heart class="w-6 h-6" />
			</div>
			<div class="font-medium select-none">{options?.nfts?.[0].likes ?? 'N/A'}</div>
		{/if}
	</div>

	<div class="w-full mx-auto mt-2 overflow-hidden transition bg-gray-100 rounded-lg select-none aspect-1" class:animate-pulse={!imgLoaded}>
		{#await preload(options.nfts[0].thumbnailUrl)}
			<Loader />
		{:then}
			{#if fileType === 'video'}
				<video crossorigin="anonymous" class="max-w-full max-h-full shadow-xl object-cover object-top w-full h-full transition" autoplay loop class:opacity-0={!imgLoaded}>
					<source src={options.nfts[0].thumbnailUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img alt="" src={options.nfts[0].thumbnailUrl} class="object-cover object-top w-full h-full transition" class:opacity-0={!imgLoaded} />
			{/if}
		{:catch _err}
			{#if fileType === 'video'}
				<video crossorigin="anonymous" class="max-w-full max-h-full shadow-xl object-cover object-top w-full h-full transition" autoplay loop class:opacity-0={!imgLoaded}>
					<source src={options.nfts[0].thumbnailUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img alt="" src={options.nfts[0].thumbnailUrl} class="object-cover object-top w-full h-full transition" class:opacity-0={!imgLoaded} />
			{/if}
		{/await}
	</div>

	<div class="flex mt-2 text-sm font-medium text-gray-600">
		<div class="flex-grow truncate">{options.nfts[0].collectionData.name || 'N/A'}</div>

		<!-- Hide price info when not present/listed -->
		{#if options?.resourceType === 'listing'}
			<div>Price</div>
		{/if}
	</div>

	<div class="flex items-center mt-2 font-semibold">
		<div class="flex-grow truncate whitespace-nowrap" class:text-xs={!options.nfts[0]?.name}>
			{options.nfts[0].name ?? `#${options.nfts[0]?.onChainId}` ?? 'No Title'}
		</div>
		<!-- Hide price info when not present/listed -->
		{#if options?.resourceType === 'listing'}
			<Eth />
			<!-- TEMPORARY FIX - ADDITIONAL FIX FOR BIDS WILL BE ADDED ONCE BIDDING DATA IS PRESENT ON LISTINGS RESPONSE -->
			<div class="ml-1">
				{options?.saleData?.formatPrice || options?.auctionData?.priceToDisplay || 'N/A'}
			</div>
		{/if}
	</div>

	{#if dotsOpened}
		<div id="popup" class="absolute flex flex-col w-32 font-bold bg-white rounded-md top-10">
			{#if menuItems.includes('transfer')}
				<button class="gradient-text transition-btn disabled:opacity-75" disabled>TRANSFER</button>
			{/if}

			{#if menuItems.includes('hide')}
				<button class="transition-btn" on:click={hideNft}>HIDE</button>
			{/if}

			{#if menuItems.includes('reveal')}
				<button class="transition-btn" on:click={revealNft}>REVEAL</button>
			{/if}
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
