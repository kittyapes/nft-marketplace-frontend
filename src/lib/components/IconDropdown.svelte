<script lang="ts">
	import ThemedCross from '$icons/themed-cross.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options: { label: string; value?: string; cb?: CallableFunction }[];

	$: if (!options?.length) {
		throw new Error('No options provided');
	}

	export let selected: { label: string; value?: string; cb?: CallableFunction } = options?.[0];
	export let opened: boolean = false;
	export let disabled = false;

	let elemOpenButton: HTMLButtonElement;
	let defaultOption = selected;

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

	function handleDefault() {
		selected = defaultOption;
		dispatch('clear');
	}
</script>

<button
	class="group min-w-fit relative text-left z-[5] text-color-black border-2 border-color-gray-lighter focus-within:border-[#1d1d1d] h-full min-h-[3rem] rounded-md pl-4 pr-2 w-full outline-none clickable flex items-center gap-2 transition {$$props.class}"
	bind:this={elemOpenButton}
	{disabled}
	class:opacity-50={disabled}
	on:click|stopPropagation={() => {
		opened = !opened;
		if (!opened) elemOpenButton?.blur();
	}}
>
	<div class="min-w-max">{selected?.label}</div>
	<div class="flex-grow" />
	<div class="h-12 border-l-2 border-color-gray-lighter max-h-max group-focus-within:border-[#1d1d1d] transition-colors" />
	<div class="min-w-[2rem] grid place-items-center clickable">
		{#if !opened}
			<div>
				<slot name="icon" />
			</div>
		{:else}
			<div on:click={handleDefault}>
				<ThemedCross />
			</div>
		{/if}
	</div>

	{#if opened}
		<div id="list-container" class="absolute -bottom-1 left-0 z-10 w-full overflow-hidden translate-y-full bg-white rounded-lg">
			{#each options as option}
				<button class="w-full px-4 py-2 font-semibold text-left hover:bg-gray-100 transition-btn active:rounded" on:click={() => handleOptionSelect(option)}>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</button>

<style>
	#list-container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}
</style>
