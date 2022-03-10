<script lang="ts">
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import ArrowDown from '$icons/arrow-down.svelte';
	import { fade, slide } from 'svelte/transition';

	export let id = '';
	export let value = '';
	export let tokens: { label: string; iconUrl: string }[] = [
		{ label: 'Eth', iconUrl: '/svg/white-eth.svg' }
		// { label: 'Waifu', iconUrl: '/svg/white-eth.svg' },
		// { label: 'Sol', iconUrl: '/svg/white-eth.svg' }
	];
	export let selected = tokens[0];
	export let placeholder = 'Enter price for NFT';

	let open = false;
</script>

<div class="relative">
	<input
		{id}
		type="number"
		class="input w-full h-12 {$$props.class}"
		class:font-semibold={value}
		{placeholder}
		bind:value
	/>

	<button
		class="bg-color-black text-white w-20 absolute top-0 right-0 h-full rounded-r-md"
		on:click={() => (open = true)}
	>
		<div class="btn flex items-center justify-center space-x-2">
			<img src={selected.iconUrl} alt="" />
			<ArrowDown />
		</div>
	</button>

	{#if open}
		<div
			class="absolute top-0 right-0 w-20 bg-color-black grid rounded-md"
			in:slide
			out:fade={{ duration: 100 }}
			use:outsideClickCallback={{ cb: () => (open = false) }}
		>
			{#each tokens as token}
				<button class="btn text-white h-12 text-left uppercase pl-4 font-semibold">
					{token.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
