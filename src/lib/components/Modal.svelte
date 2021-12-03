<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function close(event) {
		if (event.target === overlay) {
			dispatch('close');
		}
	}

	let overlay;
</script>

<div
	class="grid place-items-center fixed top-0 w-screen h-screen bg-[#1D1D1DB2]"
	on:click={close}
	bind:this={overlay}
>
	<slot />
</div>
