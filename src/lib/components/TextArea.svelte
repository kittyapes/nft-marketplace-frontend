<script lang="ts">
	export let placeholder: string = '';
	export let minChars: number = 0;
	export let maxChars: number = 0;
	export let value: string = '';
	export let containerClass = '';
	export let textAreaClass = '';
</script>

<div class="relative {containerClass}">
	<textarea
		rows="10"
		class="w-full resize-none border border-white p-4 text-sm bg-transparent outline-none focus:border-color-purple  {textAreaClass}"
		{placeholder}
		class:!outline-red-500={value.length < minChars}
		maxlength={maxChars}
		bind:value
	/>

	{#if maxChars}
		<div class="text-right text-xs absolute bottom-0 right-0 mb-4 mr-3">{value?.length || 0}/{maxChars}</div>
	{/if}
</div>

<style lang="postcss">
	textarea::placeholder {
		@apply opacity-40;
		@apply transition-all duration-200;
	}
</style>
