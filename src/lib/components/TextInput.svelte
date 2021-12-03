<script>
	export let placeholder = '';
	export let outline = false;
	export let grayOutline = false;
</script>

<input type="text" class:outline class:grayOutline {placeholder} class={$$props.class} />

<style>
	input {
		@apply rounded py-2 px-4 text-sm;
	}

	.outline {
		outline: 1px solid #1d1d1d;
	}

	.grayOutline {
		outline: 1px solid #1d1d1d4d;
	}
</style>
