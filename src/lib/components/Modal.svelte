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

<div
	class="grid place-items-center fixed top-0 w-screen h-screen bg-color-gray-dark z-20"
	on:click={close}
	bind:this={overlay}
	transition:fade={{ duration: 200, easing: expoOut }}
>
	<slot />
</div>
