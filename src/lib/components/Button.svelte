<script lang="ts">
	export let variant: 'square' | 'rounded-black' = 'square';
</script>

<button class={variant}>
	<slot />
</button>

<style>
	.square {
		@apply bg-white uppercase font-semibold px-8 py-4;
		border-radius: 0;
		width: var(--width, 220px);
	}

	.rounded-black {
		@apply bg-color-black uppercase font-semibold px-8 py-4 text-white;
		border-radius: var(--border-radius, 9999px);
		width: var(--width, 220px);
	}
</style>
