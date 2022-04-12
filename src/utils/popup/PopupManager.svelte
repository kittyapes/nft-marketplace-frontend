<script lang="ts">
	import { popupStack } from './index';
	import Modal from '$lib/components/Modal.svelte';
</script>

{#each $popupStack as popupItem}
	<Modal on:close={() => popupItem.options.closeByOutsideClick && popupItem.handler.close()}>
		<svelte:component this={popupItem.component} {...popupItem.options.props || {}} handler={popupItem.handler} on:close={() => popupItem.handler.close()} />
	</Modal>
{/each}
