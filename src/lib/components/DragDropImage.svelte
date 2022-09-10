<script lang="ts">
	import { browser } from '$app/environment';
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
	export let max_file_size = 50_000_000;

	let fileInput: HTMLInputElement;
	let files: any = [];
	let over = false;
	let fileType: 'image' | 'video' = null;

	$: if (browser && previewSrc) {
		if (!acceptedFormats.includes(previewSrc.split(':')[1].split(';')[0])) {
			previewSrc = '';
			files = [];
		} else {
			fileType = previewSrc.split('/')[0].split(':')[1] as any;
		}
	}

	$: if (browser && files.length) {
		const file: Blob = files[0];

		if (file.size > max_file_size) {
			notifyError(`The uploaded file must be ${max_file_size / 1_000_000} MB or less!`);
			files = [];
			fileType = null;
			fileInput.value = '';
		} else {
			const reader = new FileReader();
			reader.onloadend = (e) => {
				previewSrc = e.target.result as string;
			};

			reader.readAsDataURL(file);
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
			<img src={previewSrc || currentImgUrl} alt="" in:fade class="object-contain w-full max-h-full rounded" />
		{:else if (fileType === 'video' && previewSrc) || currentImgUrl}
			<video class="object-contain max-w-full max-h-full rounded" autoplay muted loop in:fade>
				<source src={previewSrc || currentImgUrl} type="video/mp4" />
				<track kind="captions" />
			</video>
		{:else if !fileType}
			{#if text}
				<div class="px-12 text-sm text-center opacity-50 text-color-black">
					{@html text}
				</div>
			{:else}
				<slot name="placeholder" />
			{/if}
		{/if}
	</button>

	<div class="mt-2 text-xs font-semibold text-center text-color-gray-accent">
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
