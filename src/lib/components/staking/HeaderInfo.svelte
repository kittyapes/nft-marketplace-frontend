<script>
	import LongLeftArrow from '$icons/long-left-arrow.svelte';

	export let hinataPerDay;
	export let waifuPerDay;
	export let annualPercentageReturn;
</script>

<div class="flex flex-col">
	<div class="flex items-center gap-2">
		<LongLeftArrow />
		<div class="uppercase font-semibold text-xs">go back</div>
	</div>
	<div class="flex">
		<div
			class="uppercase text-white tracking-tight text text-7xl [-webkit-text-stroke:1.5px_black] gradient-stroke"
		>
			stake
		</div>
		<div class="flex-grow" />
		<div class="flex flex-col">stake</div>
	</div>
</div>

<style lang="postcss">
	gradient-stroke {
		background: linear-gradient(white, white) padding-box,
			linear-gradient(to right, #868bf7, #6cc7f8) border-box;
		@apply bg-clip-text stroke-transparent stroke-1;
	}
</style>
