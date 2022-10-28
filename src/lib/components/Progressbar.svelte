<script lang="ts">
	export let value: number;
	export let points: { at: number; label: string; dot?: boolean; top_value?: string }[] = [];
</script>

<div class="relative">
	<div id="rail" class="h-1 w-full bg-white relative {$$props.class}" style="--after-width: {value === 80 ? 100 : value}%" />

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
				class="w-[3px] h-6 
					bg-gradient-to-r from-color-purple to-color-blue
					-translate-x-1/2 translate-y-[-10px]"
				class:opacity-0={point.dot == false}
			/>

			<!-- Don't delete this yet -->
			<!-- <div class="-translate-x-1/2 uppercase text-xs italic text-center font-light" class:text-gradient={value >= point.at}>
				{point.label}
			</div> -->
		</div>
	{/each}
</div>

<style type="postcss">
	#rail::after {
		@apply block absolute top-[-2px] bottom-[-2px]
		bg-gradient-to-r from-color-purple to-color-blue
		transition-all duration-300;
		content: '';
		width: var(--after-width);

		box-shadow: 0px -1px 7px rgba(142, 119, 247, 0.2), 0px -1px 7px rgba(136, 234, 255, 0.2);
	}
</style>
