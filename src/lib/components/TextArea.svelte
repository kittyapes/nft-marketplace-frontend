<script lang="ts">
	export let placeholder: string = '';
	export let maxChars: number = 0;
	export let value: string = '';

	export let blackOutline: boolean = false;
</script>

<div>
	<textarea id="" rows="10" class="w-full" {placeholder} class:blackOutline bind:value />

	{#if maxChars}
		<div class="text-right text-xs font-semibold">{value.length}/{maxChars}</div>
	{/if}
</div>

<style>
	textarea {
		@apply rounded-md py-2 px-4;
	}

	textarea::placeholder {
		@apply font-bold text-black text-xs;
	}

	.blackOutline {
		outline: 1px solid #1d1d1d;
	}
</style>
