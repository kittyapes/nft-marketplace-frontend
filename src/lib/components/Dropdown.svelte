<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options: { label: string; value?: string }[];
	export let btnClass = '';

	$: if (!options?.length) {
		throw new Error('No options provided');
	}

	export let selected: { label: string; value?: string } = options?.[0];
	export let opened: boolean = false;
	export let disabled = false;

	let elemOpenButton: HTMLButtonElement;

	$: if (opened) {
		document.addEventListener('click', (event) => {
			if (event.target !== elemOpenButton) {
				opened = false;
			}
		});
	}

	function handleOptionSelect(option) {
		selected = option;
		dispatch('select', option);
	}
</script>

<div
	class="relative select-container select-none transition {$$props.class}"
	class:opacity-50={disabled}
>
	<button
		class="text-left select"
		on:click={() => (opened = !opened)}
		bind:this={elemOpenButton}
		{disabled}
	>
		{selected.label}
	</button>

	{#if opened}
		<div
			id="list-container"
			class="absolute bottom-0 z-10 w-full overflow-hidden translate-y-full bg-white rounded-lg"
		>
			{#each options as option}
				<button
					class="w-full px-4 py-2 font-semibold text-left hover:bg-gray-100 transition-btn active:rounded"
					on:click={() => handleOptionSelect(option)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	#list-container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}
</style>
