<script lang="ts">
	import { notifyError, notifySuccess } from '$utils/toast';
	import Loader from '$lib/components/Loader.svelte';
	import { reject } from 'lodash-es';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { favoriteNft } from '$utils/nfts/favoriteNft';
	import { noTryAsync } from 'no-try';
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import { fadeImageOnLoad } from '$utils/actions/fadeImageOnLoad';

	export let title: string;
	export let assetUrl: string;
	export let id: string;
	export let favorited: boolean;
	export let options: CardPopupOptions;

	let videoAsset: HTMLVideoElement;
	let fileType;

	function handleShare() {
		navigator.clipboard.writeText(assetUrl);
		notifySuccess('Copied NFT link!');
	}

	async function handleLike() {
		const [err, res] = await noTryAsync(() => favoriteNft(options.likeIds?.[0]));

		if (err) {
			notifyError(err.message);
			console.error(err);
		} else if (res.data.message) {
			favorited = false;
			notifySuccess('Unliked NFT.');
		} else {
			favorited = true;
			notifySuccess('Liked NFT.');
		}
	}

	function handleFullscreen() {
		if (videoAsset?.requestFullscreen) {
			videoAsset.requestFullscreen();
		} else {
			window.open(assetUrl, '_blank');
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
<div class="flex flex-col justify-center w-full h-full text-center">
	<!-- Asset render container -->
	<div class="flex items-center self-center justify-center object-contain w-full max-w-lg overflow-hidden bg-gray-100 aspect-1 rounded-xl">
		{#await preload(assetUrl)}
			<Loader />
		{:then}
			{#if fileType === 'video'}
				<video class="max-w-full max-h-full shadow-xl" autoplay loop bind:this={videoAsset}>
					<source src={assetUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img src={assetUrl} class="object-cover w-full h-full shadow-xl" alt="Card asset." use:fadeImageOnLoad />
			{/if}
		{/await}
	</div>

	<!-- NFT Name -->
	<div class="mt-4 text-2xl font-bold opacity-70 justify-self-end">
		{title || 'No title'}
	</div>

	<!-- Buttons -->
	<div class="flex justify-center mt-8 mb-8 gap-x-12">
		<button class="w-6 h-6 btn" on:click={handleShare}><img src={getIconUrl('share')} alt="Share." /></button>
		<button class="w-6 h-6 btn disabled:opacity-50" on:click={handleLike} disabled={!options.nftData[0].isInternalNft}>
			<img src={favorited ? getIconUrl('heart-filled') : getIconUrl('heart-outline')} alt="Heart." class:text-red-500={favorited} />
		</button>
		<button class="w-6 h-6 btn" on:click={handleFullscreen}><img src={getIconUrl('fullscreen')} alt="Fullscreen." /></button>
	</div>
</div>
