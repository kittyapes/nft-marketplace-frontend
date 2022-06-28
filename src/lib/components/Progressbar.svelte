<script lang="ts">
	export let value: number;
	export let points: { at: number; label: string; dot?: boolean }[] = [];
</script>

<div class="relative">
	<div id="rail" class="h-4 w-full rounded-full bg-[#c4c4c4] relative {$$props.class}" style="--after-width: {value}%" />

	{#each points as point}
		<div class="absolute top-0" style="left: {point.at}%">
			<div
				class="w-6 h-6 rounded-full
					{value >= point.at ? 'bg-gradient-to-r from-color-purple to-color-blue' : 'bg-[#c4c4c4]'}
					-translate-x-1/2 translate-y-[-4px]"
				class:opacity-0={point.dot == false}
			/>

			<div
				class="-translate-x-1/2 uppercase text-sm text-center max-w-min font-light
					{value >= point.at ? 'gradient-text' : ''}"
			>
				{point.label}
			</div>
		</div>
	{/each}
</div>

<style type="postcss">
	#rail::after {
		@apply block absolute top-0 bottom-0
		bg-gradient-to-r from-color-purple to-color-blue rounded-full
		transition-all duration-300;
		content: '';
		width: var(--after-width);
	}
</style>
