<script lang="ts">
	export let text;

	export let variant: 'default' | 'selected' = 'default';
</script>

<button
	on:click
	class="border border-color-black w-44 h-44 grid place-items-center rounded-full uppercase text-color-black font-semibold text-center text-sm transition duration-200 {variant}"
>
	<div>
		{@html text}
	</div>
</button>

<style>
	.selected {
		color: white;
		background: linear-gradient(90deg, #8e77f7 -32.32%, rgba(142, 119, 247, 0.05) 113.47%), #67d4f8;
		border-width: 0;
		filter: drop-shadow(0px 4px 20px rgba(103, 103, 103, 0.25));
	}
</style>
