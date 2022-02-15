<script>
	export let selected;
</script>

<button on:click class:selected class:gradient-text={selected}>
	<slot />
</button>

<style lang="postcss">
	button {
		@apply relative font-bold h-10 whitespace-nowrap;
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
