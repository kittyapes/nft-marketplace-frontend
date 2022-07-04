<script lang="ts">
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { whiteListingTokens } from '$utils/contracts/listing';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let id = '';
	export let value = '';
	export let tokens: { label: string; iconUrl: string; value: string }[] = whiteListingTokens;
	export let selected = tokens[0];
	export let placeholder = 'Enter price for NFT';
	export let valid = true;

	export let dropdownButtonBg = '#000';
	export let dropdownButtonColor = '#fff';
	export let dropdownBg = '#000';
	export let dropdownColor = '#fff';
	export let borderColor = 'black';
	export let showLabel = false;
	export let showArrow = true;
	export let buttonDisabled = false;
	export let disabled = false;

	let open = false;

	let elemOpenButton: HTMLButtonElement;

	$: if (open) {
		document.addEventListener('click', (event) => {
			if (event.target !== elemOpenButton) {
				open = false;
			}
		});
	}

	const handleSelect = (token) => {
		selected = token;
		dispatch('select', token);
	};

	onMount(() => handleSelect(selected));
</script>

<div class="relative" class:opacity-50={disabled}>
	<input
		{id}
		type="text"
		style:border-color={borderColor}
		class="input w-full h-12 {$$props.class} {!valid && '!border-red-300'} disabled:bg-white"
		class:font-semibold={value}
		{placeholder}
		{disabled}
		bind:value
	/>
	<button
		style:background={dropdownButtonBg}
		style:color={dropdownButtonColor}
		style:border-color={borderColor}
		class="absolute top-px right-px bottom-px rounded-r-md border-l-[1px] px-4 {!valid && '!border-red-300'}"
		on:click|stopPropagation|preventDefault={() => (open = !open)}
		bind:this={elemOpenButton}
		disabled={buttonDisabled}
	>
		<div class="flex items-center justify-center space-x-2 btn">
			<img src={selected.iconUrl} alt="" class="w-4 h-4" />
			{#if showLabel} <div>{selected.label}</div> {/if}
			{#if showArrow} <ArrowDown /> {/if}
		</div>
	</button>

	{#if open}
		<div
			style:background={dropdownBg}
			class="absolute grid w-20 p-px border border-black rounded-md top-1 right-1"
			in:slide
			out:fade={{ duration: 100 }}
			use:outsideClickCallback={{ cb: () => (open = false) }}
		>
			{#each tokens as token}
				<button style:color={dropdownColor} class="h-12 pl-4 font-semibold text-left uppercase btn" on:click={() => handleSelect(token)}>
					{token.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
