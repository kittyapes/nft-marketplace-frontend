<script lang="ts">
	import getUserNftBalance from '$utils/nfts/getUserNftBalance';
	import { currentUserAddress } from '$stores/wallet';
	import type { CardOptions } from '$interfaces/ui';
	import { likedNftIds } from '$stores/user';
	import { listingToCardOptions, sanitizeNftData } from '$utils/adapters/cardOptions';
	import { getNft } from '$utils/api/nft';
	import { makeHttps } from '$utils/ipfs';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import type { PopupHandler } from '$utils/popup';
	import { onMount, SvelteComponent } from 'svelte';
	import Popup from '../Popup.svelte';
	import AssetContainer from './sections/AssetContainer.svelte';
	import Tabs from './Tabs.svelte';
	import { getOnChainListing, type ChainListing } from '$utils/contracts/listing';
	import CardCarousel from '../v2/CardCarousel/CardCarousel.svelte';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import { getListings } from '$utils/api/listing';
	import { browser } from '$app/environment';
	import { notifyError } from '$utils/toast';

	export let options: CardOptions;
	export let handler: PopupHandler;

	let isFetchingNfts = false;
	let reachedEnd = false;
	let page = 1;

	let similarCards: CardOptions[] = [];

	let chainListing: ChainListing;

	const countdownData = options?.resourceType === 'listing' ? { startTime: options.listingData?.startTime, duration: options.listingData?.duration, expired: false } : null;

	$: listedNfts = options.listingData?.nftQuantities[options.nfts[0].onChainId] || 0;

	// Log data that was used by the adapter to generate the CardPopup
	$: console.debug('[Resource Data]:', options.rawResourceData);

	function onForceExpire() {
		if (countdownData) {
			countdownData.expired = true;
		}
	}

	async function fetchNftDetail() {
		const detailedNftData = await getNft(options.nfts[0].databaseId);
		const sanitized = await sanitizeNftData(detailedNftData);

		options.nfts[0] = sanitized;
	}

	// Check NFT balance to enable/disable trading functionality
	let nftBalance = null;

	async function refreshBalance() {
		if ($currentUserAddress) {
			nftBalance = (await getUserNftBalance(options.nfts[0].contractAddress, options.nfts[0].onChainId)).balance;
		} else {
			nftBalance = 0;
		}
	}

	async function refreshOnChainListing() {
		chainListing = await getOnChainListing(options.listingData.onChainId);
		console.debug('[On chain listing data]:', chainListing);
	}

	onMount(() => {
		// We wanna refresh the NFT data from the NFT detail endpoint when the use opens
		// the popup. That will allow us to display more data than what's available from
		// the /nfts/search endpoint.
		fetchNftDetail();

		if (options.listingData?.onChainId) {
			refreshOnChainListing();
		}

		refreshBalance();
	});

	let selectedTab;
	let tabComponentInstance: SvelteComponent;

	fetch();

	function handleReachedEnd() {
		if (similarCards.length) {
			fetchMore();
		}
	}

	function fetch() {
		if (browser && !similarCards.length && !isFetchingNfts && !reachedEnd) {
			fetchMore();
		}
	}

	async function fetchMore() {
		if (reachedEnd) return;

		isFetchingNfts = true;
		const res = {} as FetchFunctionResult;
		res.res = await getListings({ collectionId: options.nfts[0].collectionData.id }, page, 10);

		const currentIndex = res.res.findIndex((nft) => nft.nfts[0].nftId === options.nfts[0].onChainId);
		if (currentIndex > -1) {
			res.res.splice(currentIndex, 1);
		}
		res.adapted = await Promise.all(res.res.map(listingToCardOptions));

		if (res.err) {
			console.error(res.err);
			notifyError('Failed to fetch more NFTs from collection.');
			return;
		}

		if (res.adapted.length === 0) {
			reachedEnd = true;
		} else {
			similarCards = [...similarCards, ...res.adapted];
			page++;
		}

		isFetchingNfts = false;
	}

	function handleClosePopup() {
		handler.close();
	}

	let enableBack = false;
</script>

<Popup class="w-full h-full rounded-none lg:w-[1400px] lg:max-h-[800px] transition-all duration-200 overscroll-contain" closeButton on:close={handler.close}>
	<div class="bg-gradient overflow-y-auto bg-repeat-y h-full blue-scrollbar">
		<div class="bg-black bg-opacity-40 py-8">
			<!-- Tabs -->
			<div class="flex px-24 gap-4">
				<!-- Back button -->
				<button class="btn disabled:opacity-0 transition duration-200" disabled={!enableBack} on:click={tabComponentInstance.goBack()}>
					<img class="h-6" src={getIconUrl('back-button')} alt="Arrow pointing left." />
				</button>

				<Tabs bind:selectedTab />
			</div>

			<!-- Main content -->
			<div class="grid grid-cols-2 h-full gap-8 mt-8 px-32">
				<!-- Left part with image and buttons -->
				<div class="pb-8">
					<AssetContainer
						assetUrl={makeHttps(options.nfts[0].assetUrl)}
						title={options.nfts[0].name ?? `#${options.nfts[0]?.onChainId}` ?? 'No Title'}
						{options}
						favorited={$likedNftIds.includes(options.nfts[0].onChainId)}
						countdown={countdownData}
						thumbnailUrl={makeHttps(options.nfts[0]?.thumbnailUrl)}
					/>
				</div>

				<!-- Right part with info and actions -->
				<div class="border-t lg:border-none pb-8">
					<svelte:component
						this={selectedTab?.sectionComponent}
						{options}
						{chainListing}
						{listedNfts}
						on:close-popup={handleClosePopup}
						on:force-expire
						on:listing-created={refreshBalance}
						bind:this={tabComponentInstance}
						bind:enableBack
					/>
				</div>
			</div>
		</div>

		{#if similarCards.length > 0}
			<div class="pt-24 pb-32 px-16">
				<CardCarousel cards={similarCards} isLoading={isFetchingNfts} on:end-reached={handleReachedEnd} />
			</div>
		{/if}
	</div>
</Popup>
