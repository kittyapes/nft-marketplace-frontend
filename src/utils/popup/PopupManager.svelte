<script>
	import { closePopup, popupComponent, popupOptions } from './index';
	import Modal from '$lib/components/Modal.svelte';
</script>

{#if $popupComponent}
	<Modal on:close={closePopup}>
		<svelte:component this={$popupComponent} {...$popupOptions?.props} />
	</Modal>
{/if}
