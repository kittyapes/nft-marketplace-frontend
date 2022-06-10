<script lang="ts">
	import { notifySuccess } from '$utils/toast';
	import Loader from '$lib/components/Loader.svelte';
	import { reject } from 'lodash-es';
	import { getIconUrl } from '$utils/misc/getIconUrl';

	export let title: string;
	export let assetUrl: string;
	export let id: string;

	let videoAsset: HTMLVideoElement;
	let fileType;

	function handleShare() {
		navigator.clipboard.writeText(assetUrl);
		notifySuccess('Copied NFT link!');
	}

	function openFullscreen() {
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

	// Buttons
	const buttons = [
		{
			iconUrl: getIconUrl('share'),
			alt: 'Share',
			onClick: handleShare
		},
		{
			iconUrl: getIconUrl('like'),
			alt: 'Like',
			onClick: () => {}
		},
		{
			iconUrl: getIconUrl('fullscreen'),
			alt: 'Fullscreen',
			onClick: openFullscreen
		}
		// {
		// 	iconUrl: getIconUrl('three-dot-menu'),
		// 	alt: 'More',
		// 	onClick: () => {}
		// }
	];
</script>

<!-- NFT Image side-->
<div class="flex flex-col justify-center w-full h-full text-center">
	<!-- Asset render container -->
	<div class="flex items-center self-center justify-center object-contain w-full max-w-lg">
		{#await preload(assetUrl)}
			<Loader />
		{:then}
			{#if fileType === 'video'}
				<video class="max-w-full max-h-full shadow-xl rounded-xl" autoplay loop bind:this={videoAsset}>
					<source src={assetUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img src={assetUrl} class="object-cover w-full h-full shadow-xl rounded-xl" alt="Card asset." />
			{/if}
		{/await}
	</div>

	<!-- NFT Name -->
	<div class="mt-4 text-2xl font-bold opacity-70 justify-self-end">
		{title || 'No title'}
	</div>

	<!-- Buttons -->
	<div class="flex justify-center mt-8 mb-8 gap-x-12">
		{#each buttons as button}
			<button class="w-6 h-6 btn" on:click={button.onClick}><img src={button.iconUrl} alt={button.alt} /></button>
		{/each}
	</div>
</div>
