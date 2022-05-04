<script lang="ts">
	import { browser } from '$app/env';
	import { acceptedImages, acceptedVideos } from '$constants';
	import { fade } from 'svelte/transition';

	export let text = 'Drag and drop an image here, or click to browse';
	export let dimensions: string = '';
	export let blob: Blob | null = null;
	export let currentImgUrl: string = null;
	export let previewSrc = '';
	export let acceptedType: 'video' | 'image' = 'image';

	let fileInput: HTMLInputElement;
	let files: any = [];
	let over = false;
	let fileType = '';

	$: if (browser && files.length) {
		const reader = new FileReader();

		reader.onload = (e) => {
			previewSrc = e.target.result as string;
		};

		const file = files[0];

		reader.readAsDataURL(files[0]);

		blob = file;

		fileType = file.type.split('/')[0];
		console.log(fileType);
	}

	function onDrop(event) {
		files = event.dataTransfer.files;
		over = false;
	}

	function onDragOver() {
		over = true;
	}

	function onDragLeave() {
		over = false;
	}
</script>

<div class="overflow-hidden">
	<button
		id="container"
		class="h-full w-full border-2 rounded-2xl border-dashed flex items-center justify-center overflow-hidden
		select-none {$$props.class}"
		on:click={() => fileInput.click()}
		on:drop|preventDefault={onDrop}
		on:dragover|preventDefault={onDragOver}
		on:dragleave={onDragLeave}
		class:over
	>
		{#if fileType === 'image' && (previewSrc || currentImgUrl)}
			<img src={previewSrc || currentImgUrl} alt="" in:fade class="max-h-full w-full object-contain rounded" />
		{:else if fileType === 'video' && (previewSrc || currentImgUrl)}
			<video class="max-w-full max-h-full rounded object-contain" autoplay loop in:fade>
				<source src={previewSrc || currentImgUrl} type="video/mp4" />
				<track kind="captions" />
			</video>
		{:else if fileType === ''}
			<div class="text-center text-color-black opacity-50 text-sm px-12">
				{@html text}
			</div>
		{/if}
	</button>

	<div class="text-xs text-center mt-2 text-color-gray-accent font-semibold">
		{dimensions}
	</div>

	<input type="file" accept={acceptedType === 'image' ? acceptedImages : acceptedVideos} class="hidden" bind:this={fileInput} bind:files />
</div>

<style lang="postcss">
	#container {
		@apply transition duration-200;
	}

	.over {
		@apply ring-4 border-opacity-0;
	}
</style>
