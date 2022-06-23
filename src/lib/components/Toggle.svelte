<!-- 
	@component

	**Props**
	 - `state`: The state to show.
	 - `onInsideLabel`: The label to show inside the toggle when `state` is `true`.
	 - `offInsideLabel`: The label to show inside the toggle when `state` is `false`.
	
	**Styling**:
	 - `--on-dot-bg`
	 - `--off-dot-bg`
	 - `--width`
 -->
<script lang="ts">
	import { fade } from 'svelte/transition';

	export let state = false;
	export let onInsideLabel = 'ON';
	export let offInsideLabel = 'OFF';
	export let style: Partial<{ button: string; pill: string }> = {};
</script>

<label class="btn relative block w-[var(--width,4.5rem)] h-6 border border-black rounded-full scale-[99%] select-none {style.pill}">
	<input type="checkbox" bind:checked={state} class="hidden" />

	{#key state}
		<div class="absolute w-full h-full font-semibold grid place-items-center text-xs" transition:fade|local>
			{state ? onInsideLabel : offInsideLabel}
		</div>
	{/key}

	<div
		style:background-color={state ? 'var(--on-dot-bg,#388dfc)' : 'var(--off-dot-bg,#000)'}
		class="absolute w-6 h-6 rounded-full top-0 bottom-0 my-auto transition-all duration-300
        {state ? 'left-[calc(100%-1.5rem+1px)]' : '-left-px'} scale-75 {style.button}"
	/>
</label>
