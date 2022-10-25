<script lang="ts">
	export let placeholder: string = '';
	export let minChars: number = 0;
	export let maxChars: number = 0;
	export let value: string = '';
	export let containerClass = '';
	export let textAreaClass = '';
</script>

<div class={containerClass}>
	<textarea
		rows="10"
		class="w-full resize-none border border-white py-2 px-4 text-sm bg-transparent {textAreaClass}"
		{placeholder}
		class:!outline-red-500={value.length < minChars}
		maxlength={maxChars}
		bind:value
	/>

	{#if maxChars}
		<div class="text-right text-xs font-semibold">{value?.length || 0}/{maxChars}</div>
	{/if}
</div>

<style lang="postcss">
	textarea::placeholder {
		@apply text-black opacity-40;
		@apply transition-all duration-200;
	}
</style>
