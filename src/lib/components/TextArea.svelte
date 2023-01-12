<script lang="ts">
	export let placeholder: string = '';
	export let minChars: number = 0;
	export let maxChars: number = 0;
	export let value: string = '';
	export let containerClass = '';
	export let textAreaClass = '';
	export let rows = 10;
	export let focusStyle = true;
</script>

<div class="relative {containerClass}">
	<!-- class:!outline-red-500={value.length < minChars} -->
	<textarea
		{rows}
		class="w-full h-full resize-none border border-white p-4  bg-transparent outline-none {focusStyle ? 'focus:border-color-purple' : ''}  {textAreaClass}"
		{placeholder}
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
