<script lang="ts">
	import { popupStack } from './index';
	import Modal from '$lib/components/Modal.svelte';
	import { browser } from '$app/environment';

	popupStack.subscribe((stack) => {
		if (!browser) return;

		const html = document.querySelector('html');

		if (stack.length > 0) {
			html.classList.add('scrollbar-hide');
		} else {
			html.classList.remove('scrollbar-hide');
		}
	});
</script>

{#each $popupStack as popupItem}
	<Modal on:close={() => popupItem.options.closeByOutsideClick && popupItem.handler.close()}>
		<svelte:component this={popupItem.component} {...popupItem.options.props || {}} handler={popupItem.handler} on:close={() => popupItem.handler.close()} />
	</Modal>
{/each}
