<script lang="ts">
	import CloseButton from '$icons/close-button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { PopupHandler } from '$utils/popup';
	import MediaDisplay from '../MediaDisplay/MediaDisplay.svelte';

	export let handler: PopupHandler;
	export let assetUrl: string;
	export let fallbackAssetUrl: string;
	export let srcUrl: string;
	export let fileType: 'image' | 'video';
</script>

<Modal>
	<div class="w-full h-full relative max-h-screen bg-black">
		<button on:click={handler.close} class="absolute top-4 right-4 w-12 h-12">
			<CloseButton />
		</button>

		<MediaDisplay {assetUrl} {fallbackAssetUrl} {srcUrl} {fileType} objectContain />
	</div>
</Modal>
