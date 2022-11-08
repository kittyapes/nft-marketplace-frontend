<script lang="ts">
	import CloseButton from '$icons/close-button.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let closeButton = false;

	function onClose() {
		dispatch('close');
	}

	function onKeydown(ev: KeyboardEvent) {
		if (ev.key === 'Escape') {
			onClose();
		}
	}

	onMount(() => {
		if (closeButton) {
			addEventListener('keydown', onKeydown);
		}
	});

	onDestroy(() => removeEventListener('keydown', onKeydown));
</script>

<div class="relative outer-div {$$props.class}">
	<div class="inner-div h-full">
		<!-- {#if closeButton}
			<button on:click={onClose} class="absolute z-50 opacity-60 right-4 top-4 transition-btn">
				<CloseButton />
			</button>
		{/if} -->

		<slot />
	</div>
</div>

<style>
	.outer-div {
		@apply p-[2px];
		background: linear-gradient(
				56.67deg,
				rgba(167, 148, 255, 0) 11.15%,
				rgba(167, 148, 255, 0.93) 57.47%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(167, 148, 255, 0) 127.41%
			),
			linear-gradient(0deg, #67d4f8, #67d4f8);
	}
	.inner-div {
		background: rgba(0, 0, 0, 0.95);
	}
</style>
