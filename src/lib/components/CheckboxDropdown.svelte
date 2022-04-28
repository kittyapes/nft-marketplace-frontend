<script lang="ts">
	import ArrowDownGradient from '$icons/arrow-down-gradient.svelte';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { createEventDispatcher } from 'svelte';
	import Checkbox from './Checkbox.svelte';

	const dispatch = createEventDispatcher();

	export let options: { label: string; checked: boolean; cb?: CallableFunction }[];

	$: if (!options?.length) {
		throw new Error('No options provided');
	}

	export let dropdownLabel: string = options?.[0].label;
	export let opened: boolean = false;
	export let disabled = false;
	export let gradient = false;

	let elemOpenButton: HTMLButtonElement;

	$: if (opened) {
		document.addEventListener('click', (event) => {
			if (event.target !== elemOpenButton) {
				opened = false;
			}
		});
	}

	function handleOptionSelect() {
		dispatch('change', options);
	}
</script>

<button
	class="group min-w-fit relative z-[5] text-left text-color-black h-full min-h-[3rem] rounded-md pl-4 pr-2 w-full outline-none clickable flex items-center gap-2 transition {$$props.class}"
	bind:this={elemOpenButton}
	{disabled}
	class:opacity-50={disabled}
	on:click|stopPropagation={() => {
		opened = !opened;
		if (!opened) elemOpenButton?.blur();
	}}
>
	{#if gradient}
		<ArrowDownGradient />
	{:else}
		<ArrowDown />
	{/if}

	<div class="min-w-max first-letter:uppercase">{dropdownLabel}</div>

	{#if opened}
		<div id="list-container" class="absolute -bottom-1 left-0 w-full overflow-hidden translate-y-full bg-white rounded-lg text-color-black flex flex-col">
			<div class="relative ">
				{#each options as option}
					<button class="px-2 py-2 font-semibold text-left hover:bg-gray-100 transition-btn active:rounded flex gap-1 ">
						<Checkbox on:change={() => handleOptionSelect} bind:checked={option.checked} />
						<div class="first-letter:uppercase">{option.label}</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</button>

<style>
	#list-container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}
</style>
