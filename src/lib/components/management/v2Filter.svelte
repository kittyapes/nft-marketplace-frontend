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
		<div id="list-container" class="absolute -bottom-1 left-0 z-10 w-full overflow-hidden translate-y-full bg-white rounded-lg" transition:slide>
			{#each options as option}
				<button class="w-full px-4 py-2 font-semibold text-left text-color-black hover:bg-gray-100 transition-btn active:rounded" on:click={() => handleOptionSelect(option)}>
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
