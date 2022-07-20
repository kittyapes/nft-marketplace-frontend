<script context="module" lang="ts">
	import type { TokenStandard } from '$interfaces';
	import type { Writable } from 'svelte/store';
	import type { ListingType } from '$utils/api/listing';

	export interface CardOptions {
		/** Determines whether the popup is rendering a listing or an NFT in the user's wallet. */
		resourceType: 'nft' | 'listing';

		/** An array of NFTs contained in a listing. If the card is rendering a single NFT,
		 * then the array length will be 1.
		 */
		nfts: [
			{
				databaseId: string;
				onChainId: string;
				name: string;
				metadata?: any;
				contractType: TokenStandard;
				creator: string;
				contractAddress: string;
				isExternal: boolean;
				collectionData: Partial<Collection>;
				likes: number;
				thumbnailUrl: string;
				assetUrl: string;
				quantity: number;
			}
		];

		/** Data used when rendering a listing. */
		listingData?: {
			databaseId: string;
			onChainId: string;
			sellerAddress: string;
			listingType: ListingType;
			paymentTokenTicker: string;
			paymentTokenAddress: string;
			startTime: number;
			endTime: number;
			duration: number;
		};

		/** Data used when adapting a listing of the type Sale. */
		saleData?: {
			price: string;
		};

		/** Data used when adapting a listing of the type Auction. */
		auctionData?: {
			startingPrice: string;
			reservePrice?: string;
		};

		/** The raw data that was used by an adapter to generate this data object. */
		rawResourceData: any;

		/** Resource is no longer valid. For example due to cancelling or purchasing a listing. Indicates that
		 * the resource should be reloaded and no further actions should performed on the resource.
		 */
		staleResource?: Writable<{ reason: string }>;

		allowPopup?: boolean;
		allowTrade?: boolean;
	}
</script>

<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Heart from '$icons/heart.svelte';
	import ThreeDots from '$icons/three-dots.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { addUrlParam } from '$utils/misc/addUrlParam';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';
	import { favoriteNft } from '$utils/nfts/favoriteNft';
	import { setPopup, updatePopupProps } from '$utils/popup';
	import { fade } from 'svelte/transition';
	import getTimeRemaining from '$utils/timeRemaining';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { likedNftIds, refreshLikedNfts } from '$stores/user';
	import { walletConnected } from '$utils/wallet';
	import WalletNotConnectedPopup from '$lib/components/WalletNotConnectedPopup.svelte';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { noTryAsync } from 'no-try';
	import { apiGetCollectionBySlug, type Collection } from '$utils/api/collection';
	import { apiHideNft, apiRevealNft } from '$utils/api/nft';
	import CardPopup from './CardPopup/CardPopup.svelte';
	import { getListingCardTimerHtml } from '$utils/misc/time';

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
			options.nfts[0].collectionData = collectionData;
			updatePopupProps(popupHandler?.id, { options });
		}
	}

	// Favoriting
	$: isUserLiked = $likedNftIds.includes(options.nfts[0].onChainId);

	async function favNFT() {
		if (!$walletConnected) {
			setPopup(WalletNotConnectedPopup, { unique: true });
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

	function updateTimerHtml() {
		timerHtml = getListingCardTimerHtml(options.listingData.startTime, options.listingData.duration);
	}

	onMount(() => {
		if (options.resourceType !== 'listing') return;

		timerInterval = setInterval(updateTimerHtml, 60_000);
		updateTimerHtml();
	});

	onDestroy(() => clearInterval(timerInterval));
</script>

<div class="relative p-4 overflow-hidden border border-color-gray-base border-opacity-50 rounded-2xl max-w-[246px]" in:fade on:click={handleClick} class:cursor-pointer={options.allowPopup}>
	<div class="flex items-center gap-x-2 h-8">
		<div class="font-bold text-[10px] uppercase">
			{@html timerHtml}
		</div>

		<!-- Owned by user -->
		{#if menuItems?.length}
			<button on:click={toggleDots} class="hover:opacity-50 h-8 w-8" transition:fade|local={{ duration: 150 }}>
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
		<img alt="" src={options.nfts[0].thumbnailUrl} class="object-cover object-top w-full h-full transition" class:opacity-0={!imgLoaded} on:load={() => (imgLoaded = true)} />
	</div>

	<div class="flex mt-2 text-sm font-medium text-gray-600">
		<div class="flex-grow truncate">{options.nfts[0].collectionData.name || 'N/A'}</div>

		<!-- Hide price info when not present/listed -->
		{#if options?.resourceType === 'listing'}
			<div>Price</div>
		{/if}
	</div>

	<div class="flex items-center mt-2 font-semibold">
		<div class="flex-grow whitespace-nowrap truncate">{options.nfts[0].name}</div>
		<!-- Hide price info when not present/listed -->
		{#if options?.resourceType === 'listing'}
			<Eth />
			<div class="ml-1">{options?.saleData?.price || 'N/A'}</div>
		{/if}
	</div>

	{#if dotsOpened}
		<div id="popup" class="absolute flex flex-col font-bold bg-white rounded-md top-10 w-32">
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
