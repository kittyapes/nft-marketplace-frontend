<script>
	import { fade } from 'svelte/transition';

	export let selected;
	export let underlineWidth = 100;
	export let uppercase = false;

	$: underlineTranslate = 0.5 * (underlineWidth - 100);
</script>

<button on:click class:selected class:text-gradient={selected} style="--underline-width: {underlineWidth}%; --underline-translate: {underlineTranslate}%" class:uppercase transition:fade|local>
	<slot />
</button>

<style lang="postcss">
	button {
		@apply relative font-bold h-10 whitespace-nowrap;
	}

	button::after {
		@apply absolute -bottom-0.5 left-0 h-[3px] bg-gradient-to-r from-color-purple to-color-blue opacity-100;
		@apply transition-opacity duration-200;
		content: '';
		opacity: 0;
		width: var(--underline-width);
		/* transform: translateX(var(--underline-translate)); */
	}

	button.selected::after {
		opacity: 1;
	}
</style>
