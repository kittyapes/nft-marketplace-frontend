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

	export let title: string;
	export let assetUrl: string;
	export let thumbnailUrl: string;
	export let favorited: boolean;
	export let options: CardOptions;
	export let countdown: { startTime: number; duration: number } = null;

	let videoAsset: HTMLVideoElement;
	let fileType;

	function handleShare() {
		navigator.clipboard.writeText(assetUrl);
		notifySuccess('Copied NFT link!');
	}

	async function handleLike() {
		const [err, res] = await noTryAsync(() => favoriteNft(options.nfts[0].databaseId));

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
			assetUrl && window.open(assetUrl, '_blank');
		}
	}

	const preload = async (src) => {
		const resp = await fetch(src);
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
</script>

<!-- NFT Image side-->
<div class="flex flex-col w-full h-full pt-12 overflow-hidden text-center">
	<!-- Asset render container -->
	<div class="flex items-center self-center justify-center object-contain w-full max-w-lg mt-1 overflow-hidden bg-gray-100 aspect-1 rounded-xl">
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
			{:else if fileType === 'image'}
				<img src={assetUrl} crossorigin="anonymous" class="object-cover w-full h-full shadow-xl" alt="Card asset." use:fadeImageOnLoad />
			{:else}
				<img src={thumbnailUrl} crossorigin="anonymous" class="object-cover w-full h-full shadow-xl" alt="Card asset." use:fadeImageOnLoad />
			{/if}
		{/await}
	</div>

	<!-- NFT Name -->
	<div class="mt-4 text-2xl font-bold opacity-70 justify-self-end">
		{title || 'No title'}
	</div>

	<!-- Buttons -->
	<div class="flex justify-center mt-4 mb-6 gap-x-12">
		<button class="w-6 h-6 btn" on:click={handleShare} disabled={!videoAsset && !assetUrl}><img src={getIconUrl('share')} alt="Share." /></button>
		<button class="w-6 h-6 btn disabled:opacity-50" on:click={handleLike} disabled={options.nfts[0].isExternal}>
			<img src={favorited ? getIconUrl('heart-filled') : getIconUrl('heart-outline')} alt="Heart." class:text-color-red={favorited} />
		</button>
		<button class="w-6 h-6 btn" disabled={!videoAsset && !assetUrl} on:click={handleFullscreen}>
			<img src={getIconUrl('fullscreen')} alt="Fullscreen." />
		</button>
	</div>

	<!-- Auction timer -->
	{#if countdown}
		<div class="pb-4 font-medium opacity-50">{capitalize(options.listingData?.listingType)} ending in:</div>
		<Countdown {...countdown} />
	{/if}
</div>
