<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	interface Option {
		value?: any;
		label: string;
		iconUrl?: string;
	}

	export let options: Option[];

	$: if (!options?.length) {
		throw new Error('No options provided');
	}

	export let selected: Option = options?.[0];
	export let opened: boolean = false;
	export let disabled = false;
	export let borderOpacity = 0.3;
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
	}

	onMount(() => {
		if (dispatchOnMount) handleOptionSelect(selected);
	});
</script>

<div class="relative select-container select-none transition {$$props.class}" class:opacity-50={disabled}>
	<button style:--tw-border-opacity={borderOpacity} class="flex items-center space-x-2 text-left select" on:click|stopPropagation={() => (opened = !opened)} bind:this={elemOpenButton} {disabled}>
		<!-- Icon -->
		{#if selected.iconUrl}
			<img src={selected.iconUrl} alt="" class="object-cover w-6 h-6 rounded-full" />
		{:else if dropdownIcon}
			<svelte:component this={dropdownIcon} />
		{/if}

		<!-- Label -->
		<div>
			{selected?.label}
		</div>
	</button>

	{#if opened}
		<div id="list-container" class="absolute bottom-0 z-20 w-full overflow-hidden overflow-y-auto translate-y-full bg-white rounded-lg max-h-72 custom-scrollbar">
			{#each options as option}
				<button class="flex items-center w-full px-4 h-12 font-semibold text-left hover:bg-gray-100 transition-btn active:rounded gap-x-2" on:click={() => handleOptionSelect(option)}>
					{#if option.iconUrl}
						<img src={option.iconUrl} alt="" class="object-cover w-6 h-6 rounded-full" />
					{/if}
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
