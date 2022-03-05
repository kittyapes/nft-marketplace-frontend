<script>
	export let placeholder = '';
	export let outline = false;
	export let grayOutline = false;
	export let value = '';
</script>

<input type="text" class:outline class:grayOutline {placeholder} class={$$props.class} bind:value />

<style>
	input {
		@apply rounded py-2 px-4 text-sm transition-all duration-200;
	}

	.outline {
		outline: 1px solid #1d1d1d;
	}

	.grayOutline {
		outline: 1px solid #1d1d1d4d;
	}

	.grayOutline:focus {
		outline: 1px solid #1d1d1d;
	}
</style>
