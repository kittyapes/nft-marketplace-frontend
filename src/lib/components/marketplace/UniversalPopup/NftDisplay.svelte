<script lang="ts">
	import Fullscreen from '$icons/fullscreen.svelte';
	import Share from '$icons/share.svelte';
	import { notifySuccess } from '$utils/toast';
	import Loader from '$lib/components/Loader.svelte';
	import { reject } from 'lodash-es';

	export let options: {
		title: string;
		imageUrl?: string;
		animationUrl?: string;
	};

	let videoAsset: HTMLVideoElement;
	let fileType;

	function handleShare() {
		navigator.clipboard.writeText(options.imageUrl);
		notifySuccess('Copied NFT link!');
	}

	function openFullscreen() {
		if (videoAsset?.requestFullscreen) {
			videoAsset.requestFullscreen();
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
<div class="w-full md:w-1/2 bg-gray-200 h-auto flex items-center justify-center">
	<div class="m-10 text-center h-full flex flex-col justify-center">
		<div class="w-96 h-96 flex items-center justify-center self-center object-contain">
			{#await preload(options.animationUrl)}
				<Loader />
			{:then}
				{#if fileType === 'video'}
					<video class="max-w-full max-h-full shadow-xl rounded-xl" autoplay loop bind:this={videoAsset}>
						<source src={options.animationUrl} type="video/mp4" />
						<track kind="captions" />
					</video>
				{:else if fileType === 'image'}
					<img src={options.imageUrl} class="w-full h-full shadow-xl rounded-xl object-cover" alt="card artwork" />
				{/if}
			{/await}
		</div>
		<!-- NFT Name -->
		{#if options.title}
			<div class="font-bold text-2xl mt-4 opacity-70 justify-self-end">
				{options.title}
			</div>
		{/if}

		<!-- Fullscreen and Share button -->
		<div class="flex justify-center mt-8 mb-8 gap-x-4">
			{#if fileType === 'video'}
				<div class="transition-btn hover:brightness-110 cursor-pointer" on:click={openFullscreen}><Fullscreen /></div>
			{:else if fileType === 'image'}
				<a href={options.imageUrl} target="_blank" class="transition-btn hover:brightness-110">
					<Fullscreen />
				</a>
			{/if}

			<button class="transition-btn hover:brightness-110" on:click={handleShare}>
				<Share />
			</button>
		</div>
	</div>
</div>
