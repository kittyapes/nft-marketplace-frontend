<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	interface Option {
		value?: any;
		label: string;
		iconUrl?: any;
		style?: string;
	}

	export let options: Option[];

	$: if (!options?.length) {
		throw new Error('No options provided');
	}

	export let selected: Option = options?.[0];
	export let opened: boolean = false;
	export let disabled = false;
	export let dropdownIcon: any = '';
	export let dispatchOnMount = true;

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

	export function setSelected(option: Option) {
		selected = option;
		dispatch('select', option);
	}

	onMount(() => {
		if (dispatchOnMount) handleOptionSelect(selected);
	});
</script>

<div class="relative select-none transition {disabled && options?.length > 1 ? 'opacity-50' : ''}">
	<button
		class="flex items-center space-x-2 text-left border border-white pl-4 outline-none cursor-pointer
	appearance-none w-full {$$props.class}"
		on:click|stopPropagation={() => (opened = !opened)}
		bind:this={elemOpenButton}
		{disabled}
	>
		<!-- Icon -->
		{#if selected?.iconUrl}
			{#if typeof selected?.iconUrl === 'string'}
				<img src={selected.iconUrl} alt="" class="object-cover w-6 h-6" />
			{:else}
				<svelte:component this={selected?.iconUrl} />
			{/if}
		{:else if dropdownIcon}
			<svelte:component this={dropdownIcon} />
		{/if}

		<!-- Label -->
		<div class="flex-grow`">
			{selected?.label}
		</div>

		{#if options?.length > 1}
			<div class="arrow-background h-full w-12 grid place-items-center border-l">
				<img src="/svg/dropdown-arrow.svg" alt="" />
			</div>
		{/if}
	</button>

	{#if opened}
		<div class="absolute bottom-0 z-20 w-full overflow-hidden overflow-y-auto translate-y-full bg-color-bg-purple max-h-72 blue-scrollbar">
			{#each options as option}
				<button class="flex items-center w-full px-4 h-12 font-semibold text-left hover:bg-gray-900 transition-btn gap-x-2" style={option.style} on:click={() => handleOptionSelect(option)}>
					{#if option.iconUrl}
						{#if typeof option?.iconUrl === 'string'}
							<img src={option.iconUrl} alt="" class="object-cover w-6 h-6" />
						{:else}
							<svelte:component this={option?.iconUrl} />
						{/if}
					{/if}
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.arrow-background {
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
	}
</style>
