<script>
	import CloseButton from '$icons/close-button.svelte';
	import { closePopup } from '$utils/popup';

	export let closeButton = false;
</script>

<div class="relative bg-white rounded-2xl pt-6 {$$props.class}">
	{#if closeButton}
		<button on:click={closePopup} class="absolute right-4 transition-btn">
			<CloseButton />
		</button>
	{/if}

	<slot />
</div>
