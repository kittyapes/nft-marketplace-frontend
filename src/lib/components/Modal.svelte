<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	const dispatch = createEventDispatcher();

	function close(event) {
		if (event.target === overlay) {
			dispatch('close');
		}
	}

	let overlay;
</script>

<div class="fixed top-0 left-0 z-20 grid w-screen h-screen place-items-center bg-color-gray-dark" on:click={close} bind:this={overlay} transition:fade={{ duration: 200, easing: expoOut }}>
	<slot />
</div>
