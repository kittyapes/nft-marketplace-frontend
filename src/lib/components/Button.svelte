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

	.square {
		@apply bg-white uppercase font-semibold rounded-none;
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
	}

	.rounded-gradient {
		@apply rounded-full px-8 py-4 text-white font-semibold;
		background: linear-gradient(90deg, #8e77f7 -32.32%, rgba(142, 119, 247, 0.05) 113.47%), #67d4f8;
	}
</style>
