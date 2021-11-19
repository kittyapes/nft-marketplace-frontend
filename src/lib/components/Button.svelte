<script lang="ts">
	export let variant:
		| 'square'
		| 'rounded-black'
		| 'rounded-outline'
		| 'rounded-shadow'
		| 'rounded-gradient' = 'square';
</script>

<button class="{variant} {$$props.class} transition-btn" on:click>
	<slot />
</button>

<style>
	button {
		width: var(--width, 220px);
		border-radius: var(--border-radius, 9999px);
		padding-top: var(--py, 1rem);
		padding-bottom: var(--py, 1rem);
		padding-left: var(--px, 2rem);
		padding-right: var(--px, 2rem);
	}

	/* Variants */
	.square {
		@apply bg-white uppercase font-semibold px-8 py-4;
		border-radius: 0;
	}

	.rounded-black {
		@apply bg-color-black uppercase font-semibold text-white;
	}

	.rounded-outline {
		@apply border-2 border-color-black uppercase font-semibold;
	}

	.rounded-shadow {
		@apply bg-white uppercase font-semibold text-color-black;
		box-shadow: 0px 2px 10px rgba(122, 122, 122, 0.2);
	}

	.rounded-gradient {
		@apply bg-gradient-to-r from-color-purple to-color-blue uppercase font-semibold rounded-2xl text-white;
		@apply bg-gradient-to-r from-color-purple to-color-blue;
	}
</style>
