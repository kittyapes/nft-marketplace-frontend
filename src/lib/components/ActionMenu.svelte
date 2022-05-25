<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options: { label: string; action: () => void }[];

	function handleOptionClick(option: { label: string; action: () => void }) {
		dispatch('optionClick', option);
	}
</script>

<div class="rounded-xl flex flex-col shadow-[0px_4px_20px_rgba(0,0,0,0.1)] py-2 px-4 space-y-2">
	{#each options as option}
		<button class="btn text-left font-semibold text-[#000000B2]" on:click={() => handleOptionClick(option)}>{option.label}</button>
	{/each}
</div>
