<script lang="ts">
	import Heart from '$icons/heart.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import WalletNotConnectedPopup from '$lib/components/WalletNotConnectedPopup.svelte';
	import { likedNftIds, refreshLikedNfts } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { apiHideNft, apiRevealNft } from '$utils/api/nft';
	import { sanitizeHtmlInternal } from '$utils/html';
	import { makeHttps } from '$utils/ipfs';
	import { getListingCardTimerHtml } from '$utils/misc/time';
	import { favoriteNft } from '$utils/nfts/favoriteNft';
	import { setPopup } from '$utils/popup';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { walletConnected } from '$utils/wallet';
	import { noTryAsync } from 'no-try';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { reject } from 'lodash-es';
	import Loader from '$icons/loader.svelte';
	import EthV2 from '$icons/eth-v2.svelte';
	import { goto } from '$app/navigation';
	import { openCardPopupFromOptions } from './CardPopup/CardPopup';
	import ThreeDots from '$icons/three-dots.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;
	export let menuItems: ('hide' | 'reveal' | 'transfer')[] = [];
	export let hideLikes = false;
	export let disabled = false;
	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';

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
		if (!options.allowPopup) {
			return;
		}

		openCardPopupFromOptions(options);
	}

	// Favoriting
	$: isUserLiked = $likedNftIds.includes(options.nfts[0].onChainId);

	async function favNFT() {
		if (!$walletConnected) {
			setPopup(WalletNotConnectedPopup, { unique: true });
			return;
		}

		const [err, res] = await noTryAsync(() => favoriteNft(options.nfts[0].fullId));

		if (err) {
			notifyError(err.message);
			console.error(err);
		} else if (res.data.message) {
			notifySuccess('Unfavorited NFT.');
		} else {
			notifySuccess('Favorited NFT.');
		}

		await refreshLikedNfts($currentUserAddress);
		dispatch('refresh-tabs', { tabs: ['favorites'] });
	}

	// Hiding
	async function hideNft(ev: Event) {
		dotsOpened = false;
		ev.stopPropagation();

		const res = await apiHideNft(options.nfts[0].fullId);

		if (res.err) {
			notifyError('Failed to hide NFT. \n' + res.err.message);
		} else {
			dispatch('hide-me');
		}
	}

	async function revealNft(ev: Event) {
		dotsOpened = false;
		ev.stopPropagation();

		const res = await apiRevealNft(options.nfts[0].fullId);

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
		timerHtml = sanitizeHtmlInternal(getListingCardTimerHtml(options.listingData?.startTime, options.listingData?.duration, options.listingData?.endTime, gridStyle));
	}

	const preload = async (src: string) => {
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

		updateTimerHtml();
		timerInterval = setInterval(updateTimerHtml, 15_000);
	});

	$: if (gridStyle) {
		updateTimerHtml();
	}

	onDestroy(() => clearInterval(timerInterval));
</script>

<div
	class="relative overflow-hidden group h-full flex flex-col"
	class:mb-4={gridStyle === 'masonry'}
	in:fade
	on:click={handleClick}
	class:cursor-pointer={options.allowPopup}
	on:mouseover={() => (isHovered = true)}
	on:focus={() => (isHovered = true)}
	on:mouseout={() => (isHovered = false)}
	on:blur={() => (isHovered = false)}
>
	<div class="absolute inset-0 gradient-border animate-gradient-border-spin z-10" />

	<div
		class:dense-nft-media={gridStyle === 'dense'}
		class:animate-pulse={!imgLoaded && options.nfts[0].thumbnailUrl}
		class="w-full mx-auto transition bg-card-gradient select-none flex-shrink flex-grow overflow-hidden {gridStyle !== 'masonry' ? 'aspect-1' : ''} "
	>
		{#if isHovered && !disabled}
			<div class="absolute flex justify-between w-full px-2 bg-black bg-opacity-60 text-white" transition:fade={{ duration: 200 }}>
				{#if options.resourceType === 'listing'}
					<button class="p-3 clickable h-12 w-40 truncate" on:click|stopPropagation={() => goto('/profile/' + options.listingData?.sellerAddress)}>{options.listingData?.sellerAddress}</button>
				{/if}
				{#if !hideLikes}
					<div class="text-transparent clickable p-3 h-12 z-20" class:text-white={isUserLiked} on:click|stopPropagation|preventDefault={favNFT}>
						<Heart />
					</div>
				{/if}
			</div>
		{/if}

		{#await preload(options.nfts[0].thumbnailUrl)}
			<div class="min-h-full w-full grid place-items-center">
				<Loader />
			</div>
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
				<video crossorigin="anonymous" class="max-w-full max-h-full object-cover object-top w-full h-full transition" autoplay loop poster={options.nfts[0].thumbnailUrl}>
					<source src={options.nfts[0].thumbnailUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img alt="" src={options.nfts[0].thumbnailUrl} class="object-cover object-top w-full h-full transition" />
			{:else}
				<div class="bg-card-gradient w-full h-full transition" />
			{/if}
		{/await}
	</div>

	<div class:normal-nft-details={gridStyle === 'normal'} class:dense-nft-details={gridStyle === 'dense'} class:hidden={gridStyle === 'masonry'} class="bg-dark-gradient flex-shrink-0">
		<div class="flex justify-between items-center">
			<div class="">
				<h4 class="text-gradient font-bold truncate  {gridStyle === 'normal' ? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7' : 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}">
					{options.nfts[0].collectionData.name || 'N/A'}
				</h4>

				<h3 class="text-white font-semibold {gridStyle === 'normal' ? 'text-base 2xl:text-xl leading-6 2xl:leading-7 h-7' : 'text-xs 2xl:text-sm leading-3 2xl:leading-4 h-4'}">
					{options?.nfts?.[0]?.name}
				</h3>
			</div>
			<!--
			{#if options.resourceType === 'nft' && options.rawResourceData.owner.toLowerCase() === $currentUserAddress.toLowerCase() && menuItems?.length}
				<button on:click|preventDefault={toggleDots} class="w-8 h-8 hover:opacity-50" transition:fade|local={{ duration: 150 }}>
					<ThreeDots />
				</button>
			{/if}-->
		</div>

		<div class="flex flex-row items-center justify-between mt-2.5 ">
			{#if timerHtml?.includes('Starts in')}
				{@html timerHtml}
			{:else if timerHtml?.includes('Ends in') || (timerHtml?.includes('Expired') && options.resourceType === 'listing')}
				<div class="flex flex-col items-start">
					<h4 class="text-gradient font-bold whitespace-nowrap {gridStyle === 'normal' ? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7' : 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}">
						{#if options.listingData?.listingType === 'auction'}
							{#if options.auctionData.highestBid !== '0'}
								Highest bid
							{:else}
								Starting Price
							{/if}
						{:else}
							Price
						{/if}
					</h4>
					<div class="flex flex-row items-center {gridStyle === 'normal' ? 'gap-x-2' : 'gap-x-1'}">
						<span><EthV2 class={gridStyle === 'normal' ? 'w-3 h-4' : 'w-2 h-3'} /></span>
						<h3 class="text-white font-semibold {gridStyle === 'normal' ? 'text-base 2xl:text-xl leading-6 2xl:leading-7' : 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}">
							{options?.listingData.shortDisplayPrice || 'N/A'}
						</h3>
					</div>
				</div>

				{@html timerHtml}
			{:else}
				<div class="flex flex-col items-start">
					<h4 class="text-gradient font-bold {gridStyle === 'normal' ? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7' : 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}">Price</h4>

					<div class="flex flex-row items-center {gridStyle === 'normal' ? 'gap-x-1' : 'gap-x-0.5'}">
						<span><EthV2 class={gridStyle === 'normal' ? 'w-2.5 2xl:w-3 h-3.5 2xl:h-4' : 'w-1.5 2xl:w-2 h-2.5 2xl:h-3'} /></span>
						<h3 class="text-white font-semibold {gridStyle === 'normal' ? 'text-base 2xl:text-xl leading-6 2xl:leading-7' : 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}">
							{options?.listingData?.shortDisplayPrice || 'N/A'}
						</h3>
					</div>
				</div>

				<div class="flex flex-col items-end">
					<h4 class="text-gradient font-bold whitespace-nowrap {gridStyle === 'normal' ? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7' : 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}">
						Highest offer
					</h4>

					<!-- TODO clarify highest offer -->
					<h3 class="text-white font-semibold {gridStyle === 'normal' ? 'text-base 2xl:text-xl leading-6 2xl:leading-7' : 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}">
						{options?.auctionData?.highestOffer || 'N/A'}
					</h3>
				</div>
			{/if}
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

	.normal-nft-details {
		@apply py-2.5 2xl:py-3 px-4 2xl:px-5;
	}

	.dense-nft-details {
		@apply py-1.5 px-2.5;
	}

	.dense-nft-media {
		@apply h-44 2xl:h-56;
	}

	.group:not(:hover) > .gradient-border {
		display: none;
	}
</style>
