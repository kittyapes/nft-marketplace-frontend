<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let periods: ('24h' | '7d' | '30d' | 'All')[] = ['24h', '7d', '30d', 'All'];
	export let selectedPeriod: '24h' | '7d' | '30d' | 'All' = periods[0];

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-row items-center gap-0">
	{#if periods?.length}
		{#each periods as period}
			<button
				class="w-16 h-12 font-medium text-2xl leading-7 hover:active"
				class:active={period === selectedPeriod}
				on:click={() => {
					selectedPeriod = period;
					dispatch('period', { period });
				}}
			>
				{period}
			</button>
		{/each}
	{/if}
</div>

<style lang="postcss">
	.active {
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
	}
	button {
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			linear-gradient(180deg, rgba(136, 234, 255, 0.05) 0%, rgba(133, 141, 247, 0.05) 100%), #000000;
	}
</style>
