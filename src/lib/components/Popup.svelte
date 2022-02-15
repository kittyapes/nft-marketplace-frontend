<script>
	import CloseButton from '$icons/close-button.svelte';
	import { closePopup } from '$utils/popup';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let closeButton = false;

	function onClose() {
		dispatch('close');
		closePopup();
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
