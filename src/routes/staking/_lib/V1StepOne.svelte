<script>
	import Button from '$lib/components/Button.svelte';
	import Circle from './Circle.svelte';

	let selectedMode = 'migrate';

	const selectMode = (mode) => (selectedMode = mode);
	const getVariant = (selectedMode, mode) => (mode === selectedMode ? 'selected' : 'default');

	const modes = [
		['unstake', 'Unstake'],
		['migrate', 'Migrate to Hinata'],
		['convert', 'Convert']
	];
</script>

<p class="font-normal text-center mt-6 text-lg">
	<span class="font-bold">Unstake, migrate</span> to HINATA and continue farming, <br /> or
	<span class="font-bold">convert</span> old rewards.
</p>

<div class="flex mt-8 gap-8">
	{#each modes as [mode, label]}
		<Circle
			text={label}
			variant={getVariant(selectedMode, mode)}
			on:click={() => selectMode(mode)}
		/>
	{/each}
</div>

<div class="w-full h-px bg-[#1d1d1d4d] mt-12" />

<div class="font-bold mt-4">
	<span class="text-sm">0</span>
	<span class="uppercase text-xs opacity-80 ml-1">WAIF has been burned in migration</span>
</div>

<div class="w-72 grid mt-4">
	<Button variant="rounded-gradient">Waifu Farming Pool</Button>
</div>

<p class="text-color-black w-[25rem] mt-6 text-sm">
	<span class="opacity-70">
		Continue farming and become a Founder of Hinata DAO by migrating and vesting your WAIF or LP
		tokens to Hinata. This is your ticket to exclusive drops, community votes, and an early
		allocation for our upcoming NFT ecosystem. Your HINATA tokens will automatically be entered into
		the staking contract and can be withdrawn at anytime.
	</span>

	<a class="text-color-black underline whitespace-nowrap font-bold" href="./choose-method">
		Read more
	</a>
</p>
