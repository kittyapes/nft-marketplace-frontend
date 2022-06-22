<script>
	import CloseButton from '$icons/close-button.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let closeButton = false;

	function onClose() {
		dispatch('close');
	}
</script>

<div class="relative bg-white rounded-2xl {$$props.class}">
	{#if closeButton}
		<button on:click={onClose} class="absolute z-50 opacity-60 right-4 top-4 transition-btn">
			<CloseButton />
		</button>
	{/if}

	<slot />
</div>
