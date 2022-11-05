<script lang="ts">
	import ArrowDownGradient from '$icons/arrow-down-gradient.svelte';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { createEventDispatcher } from 'svelte';
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import Checkbox from './Checkbox.svelte';
	import { log } from '$utils/debug';
	import { includes } from 'lodash-es';

	const dispatch = createEventDispatcher();

	export let options: { label: string; checked: boolean; cb?: CallableFunction }[];

	$: if (!options?.length) {
		throw new Error('No options provided');
	}

	export let dropdownLabel: string = options?.[0].label;
	export let opened: boolean = false;
	export let disabled = false;
	export let gradient = false;
	export let id = '';
	export let disableAllOnSelect = false;
	export let dispatchAllOptions = false;

	let elemOpenButton: HTMLButtonElement;

	function handleOptionSelect(option) {
		if (disableAllOnSelect) options.filter((o) => o !== option).forEach((o) => (o.checked = false));
		options = options;
		if (dispatchAllOptions) dispatch('change', options);
		else dispatch('change', option);
	}
</script>

<div class="relative {!opened ? 'z-[1]' : 'z-[9]'}">
	<button
		{id}
		class="group min-w-fit relative text-left text-color-black h-full min-h-[3rem] rounded-md pl-4 pr-2 w-full outline-none flex items-center transition {$$props.class} "
		{disabled}
		class:opacity-50={disabled}
		bind:this={elemOpenButton}
		on:click|stopPropagation={() => {
			opened = !opened;
		}}
	>
		{#if gradient}
			<ArrowDownGradient />
		{:else}
			<ArrowDown />
		{/if}

		<div class="min-w-max first-letter:uppercase">{dropdownLabel}</div>
	</button>

	<div
		use:outsideClickCallback={{
			cb: (e) => {
				if (!e.composedPath().includes(elemOpenButton)) opened = false;
			}
		}}
	>
		{#if opened}
			<div id="list-container" class="absolute -bottom-1 left-0 w-full overflow-hidden translate-y-full bg-white rounded-lg text-color-black flex flex-col min-w-max">
				{#each options as option}
					<button class="px-2 py-2 font-semibold text-left hover:bg-gray-100 transition-btn active:rounded flex gap-4 w-full min-w-max">
						<Checkbox on:change={() => handleOptionSelect(option)} bind:checked={option.checked} />
						<div class="first-letter:uppercase">{option.label}</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	#list-container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}
</style>
