<script lang="ts">
	import { fade } from 'svelte/transition';

	export let state = false;
	export let onInsideLabel = 'ON';
	export let offInsideLabel = 'OFF';
</script>

<label
	class="btn relative block w-[4.5rem] h-6 border border-black rounded-full scale-[99%] select-none"
>
	<input type="checkbox" bind:checked={state} class="hidden" />

	{#key state}
		<div
			class="absolute w-full h-full font-semibold grid place-items-center text-xs"
			transition:fade|local
		>
			{state ? onInsideLabel : offInsideLabel}
		</div>
	{/key}

	<div
		class="absolute w-6 h-6 bg-[#388DFC] rounded-full top-0 bottom-0 my-auto transition-all duration-300
        {state ? 'left-[calc(100%-1.5rem+1px)]' : '-left-px'} scale-75"
	/>
</label>
