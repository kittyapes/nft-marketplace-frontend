<script lang="ts">
	export let placeholder: string = '';
	export let maxChars: number = 0;
	export let value: string = '';
	export let containerClass = '';
	export let textAreaClass = '';

	export let outline: boolean = false;
</script>

<div class={containerClass}>
	<textarea
		id=""
		rows="10"
		class="w-full resize-none {textAreaClass}"
		{placeholder}
		maxlength={maxChars}
		class:outline
		bind:value
	/>

	{#if maxChars}
		<div class="text-right text-xs font-semibold">{value?.length || 0}/{maxChars}</div>
	{/if}
</div>

<style lang="postcss">
	textarea {
		@apply rounded-md py-2 px-4 text-sm;
		@apply duration-200;
		transition-property: outline-color;
	}

	textarea::placeholder {
		@apply text-black opacity-40;
		@apply transition-all duration-200;
	}

	.outline {
		outline: 1px solid #1d1d1d4d;
	}

	.outline:focus {
		outline: 1px solid #1d1d1d;
	}
</style>
