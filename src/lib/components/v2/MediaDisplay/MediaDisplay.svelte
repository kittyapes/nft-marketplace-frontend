<script lang="ts">
	import { browser } from '$app/environment';
	import Loader from '$icons/loader.svelte';
	import { fadeImageOnLoad } from '$utils/actions/fadeImageOnLoad';
	import { makeHttps } from '$utils/ipfs';

	export let assetUrl: string;
	export let fallbackAssetUrl: string;
	export let srcUrl: string = null;
	export let fileType: 'image' | 'video' = null;
	export let objectContain = false;

	export let assetLoaded = false;

	async function preload(src: string): Promise<string> {
		const resp = await fetch(makeHttps(src));
		const blob = await resp.blob();
		fileType = blob.type.split('/')[0] as any;

		return new Promise(function (resolve, reject) {
			let reader = new FileReader();

			reader.readAsDataURL(blob);
			reader.onload = () => {
				resolve(reader.result as string);
				assetLoaded = true;
				loading = false;
			};

			reader.onerror = (error) => {
				loading = false;
				reject(`Error: ${error}`);
			};
		});
	}

	let loading = !srcUrl;

	async function loadAssetOrFallback() {
		try {
			srcUrl = await preload(assetUrl);
		} catch (err) {
			console.error(err);
			srcUrl = await preload(fallbackAssetUrl);
		}
	}

	$: if (browser && !srcUrl) {
		loadAssetOrFallback();
	}
</script>

{#if loading}
	<Loader />
{:else if fileType === 'video'}
	<video crossorigin="anonymous" class="max-w-full max-h-full shadow-xl" autoplay loop>
		<source src={assetUrl} type="video/mp4" />
		<track kind="captions" />
	</video>
{:else if fileType === 'image'}
	<img
		src={srcUrl}
		crossorigin="anonymous"
		class="{(objectContain && 'object-contain') || 'object-cover'} w-full h-full shadow-xl"
		alt="Card asset."
		use:fadeImageOnLoad
	/>
{/if}

<!-- {:catch}
	{#if fileType === 'video'}
		<video crossorigin="anonymous" class="max-w-full max-h-full shadow-xl" poster={fallbackAssetUrl} autoplay loop>
			<source src={fallbackAssetUrl} type="video/mp4" />
			<track kind="captions" />
		</video>
	{:else}
		<img src={fallbackAssetUrl} crossorigin="anonymous" class="object-cover w-full h-full shadow-xl" alt="Card asset." use:fadeImageOnLoad />
	{/if}
{/await} -->
