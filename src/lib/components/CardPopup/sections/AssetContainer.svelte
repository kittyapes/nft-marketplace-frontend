<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import Countdown from '$lib/components/v2/Countdown/Countdown.svelte';
	import { refreshLikedNfts } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { fadeImageOnLoad } from '$utils/actions/fadeImageOnLoad';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { favoriteNft } from '$utils/nfts/favoriteNft';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { capitalize, reject } from 'lodash-es';
	import { noTryAsync } from 'no-try';
	import { makeHttps } from '$utils/ipfs';
	import { walletConnected } from '$utils/wallet';
	import Heart from '$icons/heart.svelte';
	import { browser } from '$app/environment';

	export let title: string;
	export let assetUrl: string;
	export let thumbnailUrl: string;
	export let favorited: boolean;
	export let options: CardOptions;
	export let countdown: { startTime: number; duration: number; expired?: boolean } = null;

	let videoAsset: HTMLVideoElement;
	let fileType;

	function handleShare() {
		navigator.clipboard.writeText(assetUrl);
		notifySuccess('Copied NFT link!');
	}

	async function handleLike() {
		const [err, res] = await noTryAsync(() => favoriteNft(options.nfts[0].fullId));

		if (err) {
			notifyError(err.message);
			console.error(err);
		} else if (res.data.message) {
			favorited = false;
			notifySuccess('Unfavorited NFT.');
			// $likedNfts = [options.likeIds, -1];
		} else {
			favorited = true;
			notifySuccess('Favorited NFT.');
			// $likedNfts = [options.likeIds, 1];
		}

		await refreshLikedNfts($currentUserAddress);
	}

	function handleFullscreen() {
		if (videoAsset?.requestFullscreen) {
			videoAsset.requestFullscreen();
		} else {
			assetUrl && window.open(makeHttps(assetUrl), '_blank');
		}
	}

	const preload = async (src) => {
		const resp = await fetch(makeHttps(src));
		const blob = await resp.blob();
		fileType = blob.type.split('/')[0];

		return new Promise(function (resolve) {
			let reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.onerror = (error) => reject(`Error: ${error}`);
		});
	};

	// Timer label
	function getTimerLabel(startTs: number, duration: number) {
		const now = Date.now() / 1000; // BE stores timestmps in seconds

		if (now <= startTs) {
			return 'starting in:';
		}

		if (now <= startTs + duration) {
			return 'ending in:';
		}

		return 'ended:';
	}

	let timerLabel: string;

	const updateTimerLabel = () => (timerLabel = getTimerLabel(countdown?.startTime, countdown?.duration));

	$: countdown, updateTimerLabel();
	$: browser && setInterval(updateTimerLabel, 1000);
</script>

<!-- NFT Image side-->
<div class="flex flex-col w-full h-full overflow-hidden scrollbar-hide">
	<!-- Asset render container -->
	<div class="flex items-center self-center justify-center flex-shrink-0 object-contain w-full overflow-hidden bg-gray-800 bg-opacity-50 aspect-1">
		{#await preload(assetUrl)}
			<Loader />
		{:then}
			{#if fileType === 'video'}
				<video crossorigin="anonymous" class="max-w-full max-h-full shadow-xl" autoplay loop bind:this={videoAsset}>
					<source src={assetUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img src={assetUrl} crossorigin="anonymous" class="object-cover w-full h-full shadow-xl" alt="Card asset." use:fadeImageOnLoad />
			{/if}
		{:catch _err}
			{#if fileType === 'video'}
				<video crossorigin="anonymous" class="max-w-full max-h-full shadow-xl" poster={thumbnailUrl} autoplay loop bind:this={videoAsset}>
					<source src={assetUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else}
				<img src={fileType === 'image' ? assetUrl : thumbnailUrl} crossorigin="anonymous" class="object-cover w-full h-full shadow-xl" alt="Card asset." use:fadeImageOnLoad />
			{/if}
		{/await}
	</div>

	<div class="flex gap-8 flex-wrap mt-8">
		<div class="w-full">
			<!-- NFT Name -->
			<div class="text-4xl font-medium text-white whitespace-nowrap">
				{title || 'No title'}
			</div>

			<!-- Buttons -->
			<div class="flex mt-4 mb-6 gap-x-12">
				<button class="w-5 btn" on:click={handleShare} disabled={!videoAsset && !assetUrl}><img src={getIconUrl('share')} alt="Share." /></button>
				<button class="w-5 btn disabled:opacity-50" class:text-white={favorited} on:click={handleLike} disabled={!$walletConnected}>
					<Heart />
				</button>
				<button class="w-5 btn" disabled={!videoAsset && !assetUrl} on:click={handleFullscreen}>
					<img src={getIconUrl('fullscreen')} alt="Fullscreen." />
				</button>
			</div>
		</div>

		<div>
			<!-- Auction timer -->
			{#if countdown}
				<div class="pb-4 text-white text-lg mt-4">
					{capitalize(options.listingData?.listingType)}

					{#if countdown.expired}
						ended
					{:else}
						ending in:
					{/if}
				</div>

				<Countdown {...countdown} />
			{/if}
		</div>
	</div>
</div>
