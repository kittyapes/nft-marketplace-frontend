<script lang="ts">
	import { browser } from '$app/env';
	import { fade } from 'svelte/transition';

	export let text = 'Drag and drop an image here, or click to browse';

	let files = [];
	let over = false;
	let previewSrc = '';

	$: if (browser && files.length) {
		const reader = new FileReader();

		reader.onload = (e) => {
			previewSrc = e.target.result as string;
		};

		reader.readAsDataURL(files[0]);
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

<div
	id="container"
	class="border-2 rounded-2xl border-dashed h-36 flex items-center justify-center overflow-hidden"
	on:drop={onDrop}
	on:dragover={onDragOver}
	on:dragleave={onDragLeave}
	class:over
>
	{#if previewSrc}
		<img src={previewSrc} alt="" in:fade class="max-h-full w-full object-contain rounded" />
	{:else}
		<div class="text-center text-color-black opacity-50 text-sm px-12">
			{text}
		</div>
	{/if}
</div>

<style>
	#container {
		@apply transition duration-200;
	}

	.over {
		@apply ring-4 border-opacity-0;
	}
</style>
