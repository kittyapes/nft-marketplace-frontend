<script lang="ts">
	export let variant: 'square' = 'square';
</script>

<button class={variant}>
	<slot />
</button>

<style>
	.square {
		@apply bg-white uppercase font-semibold px-8 py-4;
		border-radius: 0;
		width: var(--width, 200px);
	}
</style>
