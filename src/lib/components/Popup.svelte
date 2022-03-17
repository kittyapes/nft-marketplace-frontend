<script>
	import CloseButton from '$icons/close-button.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let closeButton = false;

	function onClose() {
		dispatch('close');
	}
</script>

<div class="relative bg-white rounded-2xl pt-6 {$$props.class}">
	{#if closeButton}
		<button on:click={onClose} class="absolute right-4 transition-btn">
			<CloseButton />
		</button>
	{/if}

	<slot />
</div>
