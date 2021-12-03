<script>
	export let placeholder = '';
	export let outline = true;
</script>

<input type="text" class:outline {placeholder} class={$$props.class} />

<style>
	.outline {
		@apply rounded py-2 px-4 uppercase text-sm;
		outline: 1px solid #1d1d1d;
	}
</style>
