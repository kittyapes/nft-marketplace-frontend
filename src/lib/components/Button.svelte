<script lang="ts">
	export let variant: 'square' | 'rounded-black' | 'rounded-outline' = 'square';
</script>

<button class="{variant} transition-btn" on:click>
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
</style>
