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
	import Copy from '$icons/copy.svelte';
	import Hide from '$icons/hide.svelte';
	import Sell from '$icons/sell.svelte';
	import { handleGenerativeName } from '$utils';
	import { outsideClickCallback } from '$actions/outsideClickCallback';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;
	export let menuItems: ('hide' | 'reveal' | 'transfer' | 'sell' | 'copy')[] = [];
	export let hideLikes = false;
	export let disabled = false;
	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';
	export let useLighterBackground = false;

	$: console.log(options);

	// Helpers
	let imgLoaded = false;
	let isHovered = false;
	let isFavoriting = false;

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
		isFavoriting = true;

		isUserLiked = !isUserLiked;

		const [err, res] = await noTryAsync(() => favoriteNft(options.nfts[0].fullId));

		if (err) {
			notifyError(err.message);
			console.error(err);
			isUserLiked = !isUserLiked;
		} else if (res.data.message) {
			notifySuccess('Unfavorited NFT.');
			isUserLiked = false;
		} else {
			notifySuccess('Favorited NFT.');
			isUserLiked = true;
		}

		await refreshLikedNfts($currentUserAddress);
		dispatch('refresh-tabs', { tabs: ['favorites'] });

		isFavoriting = false;
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

	// copy NFT link
	function copyNftLink() {
		try {
			navigator.clipboard.writeText(
				window.location.href + '&nftId=' + options.rawResourceData.fullId,
			);
			notifySuccess(`Successfully copied URL to clipboard`);
		} catch (err) {
			notifyError('Failed to copy URL to clipboard');
		}
	}

	function handleMenuSellClick() {
		openCardPopupFromOptions(options, { defaultTab: 'trade' });
	}

	function handleThreeDotOutsideClick() {
		dotsOpened = false;
	}

	// Listing timer
	let timerHtml: string = '';
	let timerInterval;
	let fileType;

	function updateTimerHtml() {
		timerHtml = sanitizeHtmlInternal(
			getListingCardTimerHtml(
				options.listingData?.startTime,
				options.listingData?.duration,
				options.listingData?.endTime,
				gridStyle,
			),
		);
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
	class="relative group h-full flex flex-col wrapper"
	class:mb-4={gridStyle === 'masonry'}
	in:fade
	on:click={handleClick}
	class:cursor-pointer={options.allowPopup}
	on:mouseover={() => (isHovered = true)}
	on:focus={() => (isHovered = true)}
	on:mouseout={() => (isHovered = false)}
	on:blur={() => (isHovered = false)}
>
	<div class="absolute inset-0 gradient-border animate-gradient-border-spin z-[8]" />

	<div
		class:dense-nft-media={gridStyle === 'dense'}
		class:animate-pulse={!imgLoaded && options.nfts[0].thumbnailUrl}
		class="w-full mx-auto transition bg-card-gradient select-none flex-shrink flex-grow overflow-hidden {gridStyle !==
		'masonry'
			? 'aspect-1'
			: ''} "
	>
		{#if isHovered && !disabled}
			<div
				class="absolute w-full h-12 bg-black bg-opacity-60 top-0 left-0 right-0"
				transition:fade={{ duration: 200 }}
			/>

			{#if options.resourceType === 'listing'}
				<button
					class="p-3 clickable h-12 w-40 truncate z-[9] absolute left-0 text-white"
					on:click|stopPropagation|preventDefault={() =>
						goto('/profile/' + options.listingData?.sellerAddress)}
				>
					{options.listingData?.sellerAddress}
				</button>
			{/if}

			{#if !hideLikes}
				<button
					class="text-transparent clickable p-3 h-12 z-[9] disabled:opacity-50 absolute right-0"
					class:text-white={isUserLiked}
					disabled={isFavoriting}
					on:click|stopPropagation|preventDefault={favNFT}
				>
					<Heart />
				</button>
			{/if}
		{/if}

		{#await preload(options.nfts[0].thumbnailUrl)}
			<div class="min-h-full w-full grid place-items-center">
				<Loader />
			</div>
		{:then}
			{#if fileType === 'video'}
				<video
					crossorigin="anonymous"
					class="max-w-full max-h-full object-cover object-top w-full h-full transition"
					autoplay
					loop
					class:opacity-0={!imgLoaded}
				>
					<source src={options.nfts[0].thumbnailUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img
					alt=""
					src={options.nfts[0].thumbnailUrl}
					class="object-cover object-top w-full h-full transition"
					class:opacity-0={!imgLoaded}
				/>
			{/if}
		{:catch _err}
			{#if fileType === 'video'}
				<video
					crossorigin="anonymous"
					class="max-w-full max-h-full object-cover object-top w-full h-full transition"
					autoplay
					loop
					poster={options.nfts[0].thumbnailUrl}
				>
					<source src={options.nfts[0].thumbnailUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img
					alt=""
					src={options.nfts[0].thumbnailUrl}
					class="object-cover object-top w-full h-full transition"
				/>
			{:else}
				<div class="bg-card-gradient w-full h-full transition" />
			{/if}
		{/await}
	</div>

	<div
		class:normal-nft-details={gridStyle === 'normal'}
		class:dense-nft-details={gridStyle === 'dense'}
		class:hidden={gridStyle === 'masonry'}
		class="flex-shrink-0"
		class:bg-dark-gradient={!useLighterBackground}
		class:bg-card-gradient={useLighterBackground}
	>
		<div class="flex justify-between items-center">
			<div class="">
				<h4
					class="text-gradient font-bold truncate  {gridStyle === 'normal'
						? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7'
						: 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}"
				>
					{options.nfts[0].collectionData.name || 'N/A'}
				</h4>

				<h3
					class="text-white font-semibold {gridStyle === 'normal'
						? 'text-base 2xl:text-xl leading-6 2xl:leading-7 h-7'
						: 'text-xs 2xl:text-sm leading-3 2xl:leading-4 h-4'}"
				>
					{handleGenerativeName(options?.nfts?.[0]?.name, options.nfts[0].collectionData.name)}
				</h3>
			</div>

			<!-- && options.rawResourceData.owner?.toLowerCase() === $currentUserAddress.toLowerCase() -->
			{#if options.resourceType === 'nft' && menuItems?.length}
				<div class="relative z-[9]" use:outsideClickCallback={{ cb: handleThreeDotOutsideClick }}>
					<button
						on:click|stopPropagation={toggleDots}
						class="w-8 h-8 self-start p-1 clickable"
						transition:fade|local={{ duration: 150 }}
					>
						<ThreeDots gradient={dotsOpened} />
					</button>

					{#if dotsOpened}
						<div class="absolute w-32 font-bold bg-dark-gradient right-10 top-0">
							<div class="relative z-10 flex flex-col">
								{#if menuItems.includes('sell')}
									<button class="menu-item" on:click|stopPropagation={handleMenuSellClick}>
										<Sell />
										<div class="gradient-border" />
										<span>Sell</span>
									</button>
								{/if}

								{#if menuItems.includes('copy')}
									<button class="menu-item" on:click|stopPropagation={copyNftLink}>
										<Copy />
										<div class="gradient-border" />
										<span>Copy Link</span>
									</button>
								{/if}

								{#if menuItems.includes('transfer')}
									<button class="menu-item" disabled>Transfer</button>
								{/if}

								{#if menuItems.includes('hide')}
									<button class="menu-item" on:click|stopPropagation={hideNft}>
										<Hide />
										<div class="gradient-border" />
										<span>Hide</span>
									</button>
								{/if}

								{#if menuItems.includes('reveal')}
									<button class="menu-item" on:click|stopPropagation={revealNft}>
										<Hide />
										<div class="gradient-border" />
										<span>Reveal</span>
									</button>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<div class="flex flex-row items-center justify-between mt-2.5 ">
			{#if timerHtml?.includes('Starts in')}
				{@html timerHtml}
			{:else if timerHtml?.includes('Ends in') || (timerHtml?.includes('Expired') && options.resourceType === 'listing')}
				<div class="flex flex-col items-start">
					<h4
						class="text-gradient font-bold whitespace-nowrap {gridStyle === 'normal'
							? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7'
							: 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}"
					>
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
						<h3
							class="text-white font-semibold {gridStyle === 'normal'
								? 'text-base 2xl:text-xl leading-6 2xl:leading-7'
								: 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}"
						>
							{options?.listingData.shortDisplayPrice || 'N/A'}
						</h3>
					</div>
				</div>

				{@html timerHtml}
			{:else}
				<div class="flex flex-col items-start">
					<h4
						class="text-gradient font-bold {gridStyle === 'normal'
							? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7'
							: 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}"
					>
						Price
					</h4>

					<div
						class="flex flex-row items-center {gridStyle === 'normal' ? 'gap-x-1' : 'gap-x-0.5'}"
					>
						<span>
							<EthV2
								class={gridStyle === 'normal'
									? 'w-2.5 2xl:w-3 h-3.5 2xl:h-4'
									: 'w-1.5 2xl:w-2 h-2.5 2xl:h-3'}
							/>
						</span>
						<h3
							class="text-white font-semibold {gridStyle === 'normal'
								? 'text-base 2xl:text-xl leading-6 2xl:leading-7'
								: 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}"
						>
							{options?.listingData?.shortDisplayPrice || 'N/A'}
						</h3>
					</div>
				</div>

				<div class="flex flex-col items-end">
					<h4
						class="text-gradient font-bold whitespace-nowrap {gridStyle === 'normal'
							? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7'
							: 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}"
					>
						Highest offer
					</h4>

					<!-- TODO clarify highest offer -->
					<h3
						class="text-white font-semibold {gridStyle === 'normal'
							? 'text-base 2xl:text-xl leading-6 2xl:leading-7'
							: 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}"
					>
						{options?.auctionData?.highestOffer || 'N/A'}
					</h3>
				</div>
			{/if}
		</div>
	</div>
</div>

<style type="postcss">
	.normal-nft-details {
		@apply py-2.5 2xl:py-3 px-4 2xl:px-5;
		@apply h-32 2xl:h-36;
	}

	.dense-nft-details {
		@apply py-1.5 px-2.5;
	}

	.dense-nft-media {
		@apply h-44 2xl:h-56;
	}

	.wrapper:not(:hover) > .gradient-border {
		display: none;
	}

	.menu-item {
		@apply transition-all p-2 text-left relative flex items-center gap-2;
	}

	.menu-item > div {
		@apply absolute inset-0 animate-gradient-border-spin -z-[1];
	}

	.menu-item:not(:hover) > .gradient-border {
		display: none;
	}

	.menu-item:active > .gradient-border {
		@apply border-none animate-none;

		background-image: linear-gradient(
				10deg,
				rgba(167, 148, 255, 0) 11.15%,
				rgba(167, 148, 255, 0.93) 57.47%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(167, 148, 255, 0) 127.41%
			),
			linear-gradient(0deg, #67d4f8, #67d4f8) !important;
	}
</style>
