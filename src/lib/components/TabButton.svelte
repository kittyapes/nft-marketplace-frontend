<script>
	export let selected;
</script>

<button on:click class:selected>
	<slot />
</button>

<style>
	button {
		@apply relative font-bold h-10;
	}

	button.selected {
		@apply bg-gradient-to-r from-color-purple to-color-blue text-transparent bg-clip-text;
	}

	button::after {
		@apply absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-color-purple to-color-blue opacity-100;
		@apply transition-opacity duration-200;
		content: '';
		opacity: 0;
	}

	button.selected::after {
		opacity: 1;
	}
</style>
