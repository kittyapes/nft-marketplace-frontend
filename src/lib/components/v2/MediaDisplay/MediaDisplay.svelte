<script lang="ts">
	// import { browser } from '$app/environment';
	import Loader from '$icons/loader.svelte';
	// import { fadeImageOnLoad } from '$utils/actions/fadeImageOnLoad';
	import { makeHttps } from '$utils/ipfs';

	export let assetUrl: string | null;
	export let thumbnailUrl: string;
	export let srcUrl: string = null;
	export let fileType: 'image' | 'video' = null;

	export let assetLoaded = false;
	export let preloadSuccess = null;

	$: loading = true;

	function hasLoaded(hasError: boolean) {
		if (hasError) {
			fileType = 'image';
			srcUrl = thumbnailUrl;
		} else {
			fileType = 'video';
			srcUrl = assetUrl || thumbnailUrl;
		}

		preloadSuccess = true;
		loading = false;
		assetLoaded = true;
	}
</script>

<div class="w-full h-full grid place-items-center">
	<Loader class={loading ? 'block' : 'hidden'} />
	<video
		class="h-full w-auto shadow-xl object-cover"
		autoplay
		loop
		poster={makeHttps(thumbnailUrl)}
		on:error={() => hasLoaded(true)}
		on:loadeddata={() => hasLoaded(false)}
		src={makeHttps(assetUrl || thumbnailUrl)}
		class:hidden={loading}
	>
		<source src={makeHttps(assetUrl || thumbnailUrl)} type="video/mp4" />
		<track kind="captions" />
	</video>
</div>
