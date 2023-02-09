<script lang="ts">
	import ThemedCross from '$icons/themed-cross.svelte';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

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
		dispatch('select', defaultOption);
	}
</script>

<button
	class="font-medium group min-w-fit relative text-left z-[5] text-white border-2 border-color-gray-lighter h-full min-h-[3rem] px-4 w-full outline-none clickable flex items-center gap-3 transition {$$props.class}"
	bind:this={elemOpenButton}
	{disabled}
	class:opacity-50={disabled}
	on:click|stopPropagation={() => {
		opened = !opened;
		if (!opened) elemOpenButton?.blur();
	}}
>
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
	<div class="min-w-max">{selected?.label}</div>
	{#if opened}
		<div id="list-container" class="absolute -bottom-1 left-0 z-10 w-full overflow-hidden bg-dark-gradient text-white translate-y-full " transition:slide>
			{#each options as option}
				<button class="w-full px-4 py-2 font-semibold dropdown-item text-left transition-btn active:rounded" on:click={() => handleOptionSelect(option)}>
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

	.dropdown-item:hover {
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
	}
</style>
