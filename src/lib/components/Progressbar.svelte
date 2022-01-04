<script lang="ts">
	export let value: number;
</script>

<div
	class="h-4 w-full rounded-full bg-[#c4c4c4] relative {$$props.class}"
	style="--after-width: {value}%"
/>

<style>
	div::after {
		@apply block absolute top-0 bottom-0
		bg-gradient-to-r from-color-purple to-color-blue rounded-full
		transition-all duration-300;
		content: '';
		width: var(--after-width);
	}
</style>
