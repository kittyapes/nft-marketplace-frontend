<script lang="ts">
	export let value: number;
	export let points: { at: number; label: string; dot?: boolean; top_value?: string }[] = [];
</script>

<div class="relative mt-8">
	<div id="rail" class="h-4 w-full rounded-full bg-[#c4c4c4] relative {$$props.class}" style="--after-width: {value === 80 ? 100 : value}%" />

	{#each points as point}
		{#if point.top_value}
			<div
				class="-translate-x-1/2 uppercase text-xs text-center font-light absolute -top-[150%] whitespace-nowrap"
				class:text-gradient={value >= point.at || point.at === 100}
				class:font-extrabold={point.at === 100}
				style="left: {point.at}%"
			>
				{point.top_value}
			</div>
		{/if}
		<div class="absolute top-0" style="left: {point.at}%">
			<div
				class="w-6 h-6 rounded-full
					{value >= point.at || (point.at === 100 && value === 80) ? 'bg-gradient-to-r from-color-purple to-color-blue' : 'bg-[#c4c4c4]'}
					-translate-x-1/2 translate-y-[-4px]"
				class:opacity-0={point.dot == false}
			/>

			<div class="-translate-x-1/2 uppercase text-xs italic text-center font-light" class:text-gradient={value >= point.at}>
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
