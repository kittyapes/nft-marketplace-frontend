<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Heart from '$icons/heart.svelte';
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
	import { getListingCardTimerHtml, isFuture } from '$utils/misc/time';
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
	export let disabled = false;

	// Helpers
	let imgLoaded = false;
	let isHovered = false;

	// Menu
	let dotsOpened = false;

	const toggleDots = (ev: Event) => {
		dotsOpened = !dotsOpened;
		ev.stopPropagation();
	};

	// Universal Popup
	async function handleClick(ev) {
		if (!options.allowPopup) return;

		const id = options.resourceType === 'nft' ? options.nfts[0].fullId : options.listingData.onChainId;

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
		} else {
			notifySuccess('Favorited NFT.');
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

<div
	class="relative overflow-hidden group !border-2 border-transparent"
	class:gradient-border={isHovered && !disabled}
	in:fade
	on:click={handleClick}
	class:cursor-pointer={options.allowPopup}
	on:mouseover={() => (isHovered = true)}
	on:focus={() => (isHovered = true)}
	on:mouseout={() => (isHovered = false)}
	on:blur={() => (isHovered = false)}
>
	<!--
		// Owned by user
		{#if menuItems?.length}
			<button on:click={toggleDots} class="w-8 h-8 hover:opacity-50" transition:fade|local={{ duration: 150 }}>
				<ThreeDots />
			</button>
		{/if} 
	-->
	<div class="w-full mx-auto overflow-hidden transition bg-card-gradient select-none aspect-1 h-[530px] relative" class:animate-pulse={!imgLoaded && options.nfts[0].thumbnailUrl}>
		{#if isHovered && !disabled}
			<div class="absolute flex justify-between w-full px-2 bg-black bg-opacity-60" transition:fade={{ duration: 200 }}>
				<div class="p-3 clickable h-12" on:click|stopPropagation={() => false}>@Seller</div>
				{#if !hideLikes}
					<div class="text-transparent clickable p-3 h-12" class:text-white={isUserLiked} on:click|stopPropagation={favNFT}>
						<Heart />
					</div>
				{/if}
			</div>
		{/if}
		{#await preload(options.nfts[0].thumbnailUrl)}
			<Loader />
		{:then}
			{#if fileType === 'video'}
				<video crossorigin="anonymous" class="max-w-full max-h-full object-cover object-top w-full h-full transition" autoplay loop class:opacity-0={!imgLoaded}>
					<source src={options.nfts[0].thumbnailUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img alt="" src={options.nfts[0].thumbnailUrl} class="object-cover object-top w-full h-full transition" class:opacity-0={!imgLoaded} />
			{/if}
		{:catch _err}
			{#if fileType === 'video'}
				<video crossorigin="anonymous" class="max-w-full max-h-full object-cover object-top w-full h-full transition" autoplay loop class:opacity-0={!imgLoaded}>
					<source src={options.nfts[0].thumbnailUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img alt="" src={options.nfts[0].thumbnailUrl} class="object-cover object-top w-full h-full transition" class:opacity-0={!imgLoaded} />
			{/if}
		{/await}
	</div>
	<div class="flex flex-col gap-2 bg-dark-gradient p-2 letter-spacing">
		<div class="flex flex-col">
			<div class="flex-grow truncate text-sm font-bold text-gradient">{options.nfts[0].collectionData.name || 'N/A'}</div>

			<!-- Hide price info when not present/listed -->
			<div class="flex-grow truncate whitespace-nowrap font-semibold text-xl text-white" class:text-xs={!options.nfts[0]?.name}>
				{options.nfts[0].name ?? `#${options.nfts[0]?.onChainId}` ?? 'No Title'}
			</div>
		</div>
		<div class="flex justify-between items-center">
			{#if !isFuture(options?.listingData?.startTime)}
				<div class="flex flex-col">
					{#if options?.resourceType === 'listing'}
						<div class="text-sm font-bold text-gradient">Price</div>
						<div class="flex gap-1 items-center text-lg font-semibold text-white">
							<div>
								{options.listingData.shortDisplayPrice || 'N/A'}
							</div>
							<Eth />
						</div>
					{/if}
				</div>
			{/if}

			<div class="">
				{@html timerHtml}
			</div>
		</div>
	</div>

	<!--
	{#if dotsOpened}
		<div id="popup" class="absolute flex flex-col w-32 font-bold bg-white rounded-md top-10">
			{#if menuItems.includes('transfer')}
				<button class="text-gradient transition-btn disabled:opacity-75" disabled>TRANSFER</button>
			{/if}

			{#if menuItems.includes('hide')}
				<button class="transition-btn" on:click={hideNft}>HIDE</button>
			{/if}

			{#if menuItems.includes('reveal')}
				<button class="transition-btn" on:click={revealNft}>REVEAL</button>
			{/if}
		</div>
	{/if}-->
</div>

<style type="postcss">
	#popup {
		@apply px-3 py-3 space-y-2;
		filter: drop-shadow(0px 4px 20px rgba(136, 136, 136, 0.25));
	}

	#popup > button {
		@apply text-left font-bold;
	}

	.letter-spacing {
		letter-spacing: 0.02em;
	}
</style>
