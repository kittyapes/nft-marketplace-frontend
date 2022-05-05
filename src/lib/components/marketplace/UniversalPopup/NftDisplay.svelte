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
	<div class="m-10 text-center h-full flex flex-col justify-end">
		<div class="w-96 h-96 flex items-center justify-center self-center">
			{#if options.animationUrl}
				{#await preload(options.animationUrl)}
					<Loader />
				{:then}
					<video class="max-w-full max-h-full shadow-xl rounded-xl" autoplay loop bind:this={videoAsset}>
						<source src={options.animationUrl} type="video/mp4" />
						<track kind="captions" />
					</video>
				{/await}
			{:else}
				<img src={options.imageUrl} class="max-w-full max-h-full shadow-xl rounded-xl" alt="card artwork" />
			{/if}
		</div>
		<!-- NFT Name -->
		{#if options.title}
			<div class="font-bold text-2xl mt-4 opacity-70 justify-self-end">
				{options.title}
			</div>
		{/if}

		<!-- Fullscreen and Share button -->
		<div class="flex justify-center mt-8 mb-8 gap-x-4">
			{#if options.animationUrl}
				<div class="transition-btn hover:brightness-110 cursor-pointer" on:click={openFullscreen}><Fullscreen /></div>
			{:else}
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
