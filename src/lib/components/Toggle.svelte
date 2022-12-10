<script lang="ts">
	import { fade } from 'svelte/transition';

	export let state = false;
</script>

<label class="btn relative block w-[var(--width,3rem)] h-6 border border-white scale-[99%] select-none">
	<input type="checkbox" bind:checked={state} class="hidden" />

	{#key state}
		<div class="absolute w-full h-full font-semibold grid place-items-center text-xs" transition:fade|local />
	{/key}

	<div
		class="outer-dot-square absolute w-6 h-6 top-0 bottom-0 my-auto transition-all duration-300
        {state ? 'left-[calc(100%-1.5rem+1px)]' : '-left-px'} scale-75"
		class:opacity-50={!state}
	>
		<div class="inner-dot-square" />
	</div>
</label>

<style>
	.outer-dot-square {
		@apply p-1;
		background: linear-gradient(124.99deg, rgba(142, 119, 247, 0.74) 16.62%, rgba(142, 119, 247, 0.46) 47.91%, rgba(142, 119, 247, 0.14) 70.36%, rgba(142, 119, 247, 0.03) 82.35%),
			linear-gradient(0deg, #88eaff, #88eaff);
	}

	.inner-dot-square {
		@apply h-full;
		background: linear-gradient(
				56.67deg,
				rgba(167, 148, 255, 0) 11.15%,
				rgba(167, 148, 255, 0.93) 57.47%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(167, 148, 255, 0) 127.41%
			),
			#67d4f8;
	}
</style>
