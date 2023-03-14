<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import Countdown from '$lib/components/v2/Countdown/Countdown.svelte';
	import { refreshLikedNfts } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { favoriteNft } from '$utils/nfts/favoriteNft';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { capitalize } from 'lodash-es';
	import { noTryAsync } from 'no-try';
	import { walletConnected } from '$utils/wallet';
	import Heart from '$icons/heart.svelte';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import {
		getValuesForEndingTs,
		getValuesForStartingTs,
	} from '$lib/components/v2/Countdown/Countdown';
	import { handleGenerativeName } from '$utils';
	import { setPopup } from '$utils/popup';
	import FullScreenMediaPopup from '$lib/components/v2/FullScreenMediaPopup/FullScreenMediaPopup.svelte';
	import MediaDisplay from '$lib/components/v2/MediaDisplay/MediaDisplay.svelte';

	export let title: string;
	export let assetUrl: string;
	export let thumbnailUrl: string;
	export let favorited: boolean;
	export let options: CardOptions;
	export let countdown: { startTime: number; duration: number; expired?: boolean } = null;

	let assetLoaded;
	let isFavoriting = false;

	function handleShare() {
		navigator.clipboard.writeText(assetUrl);
		notifySuccess('Copied NFT link!');
	}

	async function handleLike() {
		isFavoriting = true;

		favorited = !favorited;

		const [err, res] = await noTryAsync(() => favoriteNft(options.nfts[0].fullId));

		if (err) {
			notifyError(err.message);
			console.error(err);
		} else if (res.data.message) {
			favorited = false;
			notifySuccess('Unfavorited NFT.');
		} else {
			favorited = true;
			notifySuccess('Favorited NFT.');
		}

		await refreshLikedNfts($currentUserAddress);
		isFavoriting = false;
	}

	function handleFullscreen() {
		setPopup(FullScreenMediaPopup, {
			props: { assetUrl, fallbackAssetUrl: thumbnailUrl, srcUrl, fileType },
		});
	}

	// Timer label
	function updateTimer() {
		const startTs = countdown?.startTime;
		const duration = countdown?.duration;

		const now = Date.now() / 1000; // BE stores timestmps in seconds

		if (now <= startTs) {
			countdownLabel = 'starting in:';
			countdownValues = getValuesForStartingTs(startTs);
			return;
		}

		if (now <= startTs + duration) {
			countdownLabel = 'ending in:';
			countdownValues = getValuesForEndingTs(startTs, duration);
			return;
		}

		countdownLabel = 'ended';
	}

	let countdownLabel: string;
	let countdownValues = [];

	$: countdown, updateTimer();

	let interval: any;

	$: if (browser) {
		interval = setInterval(updateTimer, 1000);
	}

	onDestroy(() => {
		clearInterval(interval);
	});

	let srcUrl: string;
	let fileType: 'image' | 'video';
</script>

<!-- NFT Image side-->
<div class="flex flex-col w-full h-full overflow-hidden scrollbar-hide">
	<!-- Asset render container -->
	<div
		class="flex items-center self-center justify-center flex-shrink-0 object-contain w-full overflow-hidden bg-gray-800 bg-opacity-50 aspect-1"
	>
		<MediaDisplay
			{assetUrl}
			fallbackAssetUrl={thumbnailUrl}
			bind:srcUrl
			bind:fileType
			bind:assetLoaded
		/>
	</div>

	<div class="flex gap-8 flex-wrap mt-8">
		<div class="w-full">
			<!-- NFT Name -->
			<div class="text-4xl font-medium text-white">
				{handleGenerativeName(title, options.nfts[0].collectionData.name) || 'No title'}
			</div>

			<!-- Buttons -->
			<div class="flex mt-4 mb-6 gap-x-12">
				<!-- Share -->
				<button class="w-5 btn" on:click={handleShare} disabled={!assetLoaded && !assetUrl}>
					<img src={getIconUrl('share')} alt="Share." />
				</button>

				<!-- Like -->
				<button
					class="w-5 btn disabled:opacity-50 text-transparent"
					class:text-white={favorited}
					on:click={handleLike}
					disabled={!$walletConnected || isFavoriting}
				>
					<Heart />
				</button>

				<!-- Fullscreen -->
				<button class="w-5 btn" disabled={!assetLoaded && !assetUrl} on:click={handleFullscreen}>
					<img src={getIconUrl('fullscreen')} alt="Fullscreen." />
				</button>
			</div>
		</div>

		<div>
			<!-- Auction timer -->
			{#if countdown}
				<div class="pb-4 text-white text-lg mt-4">
					{capitalize(options.listingData?.listingType)}
					{countdownLabel}
				</div>

				<Countdown values={countdownValues} />
			{/if}
		</div>
	</div>
</div>
