<script lang="ts">
	import ArrowDown from '$icons/arrow-down.svelte';
	import { createEventDispatcher } from 'svelte';
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import Checkbox from './Checkbox.svelte';

	const dispatch = createEventDispatcher();

	export let options: { label: string; checked: boolean; cb?: CallableFunction }[];

	$: if (!options?.length) {
		throw new Error('No options provided');
	}

	export let dropdownLabel: string = options?.[0].label;
	export let opened: boolean = false;
	export let disabled = false;
	export let disabledOpacity = true;
	export let id = '';
	export let disableAllOnSelect = false;
	export let dispatchAllOptions = false;
	export let arrowGradient = {};

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
		class="group min-w-fit relative text-left text-white h-full min-h-[3rem] rounded-md pl-4 pr-2 w-full outline-none flex items-center transition {$$props.class} "
		{disabled}
		class:opacity-50={disabled && disabledOpacity}
		bind:this={elemOpenButton}
		on:click|stopPropagation={() => {
			opened = !opened;
		}}
	>
		{#if !disabled}
			<ArrowDown gradientColors={arrowGradient} {id} />
		{/if}

		<div class="min-w-max first-letter:uppercase">{dropdownLabel}</div>
	</button>

	<div
		use:outsideClickCallback={{
			cb: (e) => {
				if (!e.composedPath().includes(elemOpenButton)) opened = false;
			},
		}}
	>
		{#if opened}
			<div id="list-container" class="absolute -bottom-1 left-0 w-full overflow-hidden translate-y-full bg-dark-gradient text-white flex flex-col min-w-max">
				{#each options as option}
					<button class="px-2 py-2 font-semibold text-left dropdown-item transition-btn active:rounded flex gap-4 w-full min-w-max">
						<Checkbox on:change={() => handleOptionSelect(option)} bind:checked={option.checked} />
						<div class="first-letter:uppercase">{option.label}</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style type="postcss">
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
