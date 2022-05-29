<script lang="ts">
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import ArrowDown from '$icons/arrow-down.svelte';
	import HinataLogoToken from '$icons/hinata-logo-token.svelte';
	import { fade, slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { HinataTokenAddress, WethContractAddress } from '$constants/contractAddresses';

	const dispatch = createEventDispatcher();

	export let id = '';
	export let value = '';
	export let tokens: { label: string; iconUrl: string; value: string }[] = [
		{ label: 'Eth', iconUrl: '/svg/white-eth.svg', value: WethContractAddress },
		{ label: 'Hi', iconUrl: '/svg/currency/hinata-logo-token.svg', value: HinataTokenAddress }
		// { label: 'Sol', iconUrl: '/svg/white-eth.svg' }
	];
	export let selected = tokens[0];
	export let placeholder = 'Enter price for NFT';
	export let valid = true;

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
	<input {id} type="number" class="input w-full h-12 {$$props.class} {!valid && 'border-red-300'}" class:font-semibold={value} {placeholder} bind:value />
	<button class="bg-color-black text-white w-20 absolute top-0 right-0 h-full rounded-r-md" on:click|stopPropagation|preventDefault={() => (open = !open)} bind:this={elemOpenButton}>
		<div class="btn flex items-center justify-center space-x-2">
			<img src={selected.iconUrl} alt="" class="w-6 h-6" />
			<ArrowDown />
		</div>
	</button>

	{#if open}
		<div class="absolute top-0 right-0 w-20 bg-color-black grid rounded-md" in:slide out:fade={{ duration: 100 }} use:outsideClickCallback={{ cb: () => (open = false) }}>
			{#each tokens as token}
				<button class="btn text-white h-12 text-left uppercase pl-4 font-semibold" on:click={() => handleSelect(token)}>
					{token.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
