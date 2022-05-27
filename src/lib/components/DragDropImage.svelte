<script lang="ts">
	import { browser } from '$app/env';
	import { notifyError } from '$utils/toast';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	// TODO refactor to completely remove this and use the placeholder named slot instead
	export let text = 'Drag and drop an image here, or click to browse';
	export let dimensions: string = '';
	export let blob: Blob | null = null;
	export let currentImgUrl: string = null;
	export let previewSrc = '';
	export let acceptedFormats: string[] = [];

	let fileInput: HTMLInputElement;
	let files: any = [];
	let over = false;
	let fileType: 'image' | 'video' = null;

	$: if (browser && previewSrc) {
		fileType = previewSrc.split('/')[0].split(':')[1] as any;
	}

	$: if (browser && files.length) {
		const file: Blob = files[0];

		fileType = file.type.split('/')[0] as any;

		if (file.size > 50_000_000) {
			notifyError('The uploaded file must be 50 MB or less!');
			files = [];
			fileType = null;
			fileInput.value = '';
		} else {
			const reader = new FileReader();

			reader.onload = (e) => {
				previewSrc = e.target.result as string;
			};

			reader.readAsDataURL(files[0]);

			blob = file;

			dispatch('new-blob', { blob });
		}
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
		{#if (fileType === 'image' && previewSrc) || currentImgUrl}
			<img src={previewSrc || currentImgUrl} alt="" in:fade class="max-h-full w-full object-contain rounded" />
		{:else if (fileType === 'video' && previewSrc) || currentImgUrl}
			<video class="max-w-full max-h-full rounded object-contain" autoplay muted loop in:fade>
				<source src={previewSrc || currentImgUrl} type="video/mp4" />
				<track kind="captions" />
			</video>
		{:else if !fileType}
			{#if text}
				<div class="text-center text-color-black opacity-50 text-sm px-12">
					{@html text}
				</div>
			{:else}
				<slot name="placeholder" />
			{/if}
		{/if}
	</button>

	<div class="text-xs text-center mt-2 text-color-gray-accent font-semibold">
		{dimensions}
	</div>

	<input type="file" accept={acceptedFormats.join(',')} class="hidden" bind:this={fileInput} bind:files />
</div>

<style lang="postcss">
	#container {
		@apply transition duration-200;
	}

	.over {
		@apply ring-4 border-opacity-0;
	}
</style>
