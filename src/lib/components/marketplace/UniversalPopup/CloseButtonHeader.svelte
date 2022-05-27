<script>
	import CloseButton from '$icons/close-button.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="border-b border-black border-opacity-30 pb-2">
	<button class="btn flex items-center gap-2 ml-auto h-5 -translate-y-2" on:click={() => dispatch('close')}>
		<CloseButton />
	</button>
</div>
