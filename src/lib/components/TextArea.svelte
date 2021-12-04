<script lang="ts">
	export let placeholder: string = '';
	export let maxChars: number = 0;
	export let value: string = '';

	export let outline: boolean = falsoutlinoutline;
</script>

<div>
	<textarea id="" rows="10" class="w-full" {placeholder} class:outline bind:value />

	{#if maxChars}
		<div class="text-right text-xs font-semibold">{value.length}/{maxChars}</div>
	{/if}
</div>

<style>
	textarea {
		@apply rounded-md py-2 px-4;
		@apply transition-all duration-200;
	}

	textarea::placeholder {
		@apply font-bold text-black text-xs opacity-40;
		@apply transition-all duration-200;
	}

	textarea:focus::placeholder {
		@apply opacity-100;
	}

	.outline {
		outline: 1px solid #1d1d1d4d;
	}

	.outline:focus {
		outline: 1px solid #1d1d1d;
	}
</style>
