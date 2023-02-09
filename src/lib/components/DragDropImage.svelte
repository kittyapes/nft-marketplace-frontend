<script lang="ts">
	import { browser } from '$app/environment';
	import { notifyError } from '$utils/toast';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let dimensions: string = '';
	export let blob: Blob | null = null;
	export let currentImgUrl: string = null;
	export let previewSrc = '';
	export let acceptedFormats: string[] = [];
	export let max_file_size = 50_000_000;

	let fileInput: HTMLInputElement;
	let files: any = [];
	let over = false;
	let isHovered = false;
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

<div class="overflow-hidden flex flex-col items-center relative {$$props.class}">
	<button
		id="container"
		class="h-full w-full border border-dashed flex items-center justify-center overflow-hidden hover:bg-gradient-a
		select-none "
		on:click={() => fileInput.click()}
		on:drop|preventDefault={onDrop}
		on:dragover|preventDefault={onDragOver}
		on:dragleave={onDragLeave}
		on:mouseenter={() => (isHovered = true)}
		on:mouseleave={() => (isHovered = false)}
		class:over
		class:bg-gradient-a={isHovered}
	>
		{#if (fileType === 'image' && previewSrc) || currentImgUrl}
			<img src={previewSrc || currentImgUrl} alt="" in:fade class="object-contain w-full max-h-full rounded" />
		{:else if (fileType === 'video' && previewSrc) || currentImgUrl}
			<video class="object-contain max-w-full max-h-full rounded" autoplay muted loop in:fade>
				<source src={previewSrc || currentImgUrl} type="video/mp4" />
				<track kind="captions" />
			</video>
		{:else if !fileType}
			<slot name="placeholder" />
		{/if}
	</button>

	<!-- <span class="text-xs"> -->
	<slot name="lower_text" />
	<!-- </span> -->

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
