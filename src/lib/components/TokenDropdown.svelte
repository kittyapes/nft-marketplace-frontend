<script lang="ts">
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { fade, slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { HinataTokenAddress, WethContractAddress } from '$constants/contractAddresses';

	const dispatch = createEventDispatcher();

	export let id = '';
	export let value = '';
	export let tokens: { label: string; iconUrl: string; value: string }[] = [
		{ label: 'ETH', iconUrl: '/svg/white-eth.svg', value: WethContractAddress },
		{ label: 'HI', iconUrl: '/svg/currency/hinata-logo-token.svg', value: HinataTokenAddress }
		// { label: 'Sol', iconUrl: '/svg/white-eth.svg' }
	];
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
</script>

<div class="relative">
	<input {id} type="number" style:border-color={borderColor} class="input w-full h-12 {$$props.class} {!valid && 'border-red-300'}" class:font-semibold={value} {placeholder} bind:value />
	<button
		style:background={dropdownButtonBg}
		style:color={dropdownButtonColor}
		style:border-color={borderColor}
		class="absolute top-px right-px bottom-px rounded-r-md border-l-[1px] px-4"
		on:click|stopPropagation|preventDefault={() => (open = !open)}
		bind:this={elemOpenButton}
		disabled={buttonDisabled}
	>
		<div class="btn flex items-center justify-center space-x-2">
			<img src={selected.iconUrl} alt="" class="w-4 h-4" />
			{#if showLabel} <div>{selected.label}</div> {/if}
			{#if showArrow} <ArrowDown /> {/if}
		</div>
	</button>

	{#if open}
		<div
			style:background={dropdownBg}
			class="absolute top-1 right-1 w-20 grid rounded-md p-px border border-black"
			in:slide
			out:fade={{ duration: 100 }}
			use:outsideClickCallback={{ cb: () => (open = false) }}
		>
			{#each tokens as token}
				<button style:color={dropdownColor} class="btn h-12 text-left uppercase pl-4 font-semibold" on:click={() => handleSelect(token)}>
					{token.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
