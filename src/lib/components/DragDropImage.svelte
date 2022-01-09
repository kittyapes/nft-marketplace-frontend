<script lang="ts">
	import { browser } from '$app/env';
	import { acceptedImages } from '$constants';
	import { fade } from 'svelte/transition';

	export let text = 'Drag and drop an image here, or click to browse';
	export let blob: Blob | null = null;
	export let currentImgUrl: string = null;

	let fileInput: HTMLInputElement;
	let files: any = [];
	let over = false;
	let previewSrc = '';

	$: if (browser && files.length) {
		const reader = new FileReader();

		reader.onload = (e) => {
			previewSrc = e.target.result as string;
		};

		const file = files[0];

		reader.readAsDataURL(files[0]);

		blob = file;
	}

	function onDrop(event) {
		event.preventDefault();
		files = event.dataTransfer.files;
		over = false;
	}

	function onDragOver(event) {
		event.preventDefault();
		over = true;
	}

	function onDragLeave() {
		over = false;
	}
</script>

<button
	id="container"
	class="border-2 rounded-2xl border-dashed h-36 flex items-center justify-center overflow-hidden
	select-none"
	on:click={() => fileInput.click()}
	on:drop={onDrop}
	on:dragover={onDragOver}
	on:dragleave={onDragLeave}
	class:over
>
	{#if previewSrc || currentImgUrl}
		<img
			src={previewSrc || currentImgUrl}
			alt=""
			in:fade
			class="max-h-full w-full object-contain rounded"
		/>
	{:else}
		<div class="text-center text-color-black opacity-50 text-sm px-12">
			{text}
		</div>
	{/if}
</button>

<input type="file" accept={acceptedImages} class="hidden" bind:this={fileInput} bind:files />

<style>
	#container {
		@apply transition duration-200;
	}

	.over {
		@apply ring-4 border-opacity-0;
	}
</style>
