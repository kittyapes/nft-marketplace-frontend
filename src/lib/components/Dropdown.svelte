<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options: { label: string; value?: string }[];

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

<div class="relative select-container select-none {$$props.class}">
	<button
		class="select text-left"
		on:click={() => (opened = !opened)}
		bind:this={elemOpenButton}
		{disabled}
	>
		{selected.label}
	</button>

	{#if opened}
		<div
			id="list-container"
			class="absolute bottom-0 translate-y-full bg-white rounded-lg overflow-hidden z-10 w-full"
		>
			{#each options as option}
				<button
					class="font-semibold text-left py-2 px-4 hover:bg-gray-100 w-full transition-btn active:rounded"
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
