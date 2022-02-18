<script>
	import Button from '$lib/components/Button.svelte';
	import Circle from '$lib/components/staking/Circle.svelte';

	let selectedMode = 'farm';

	const selectMode = (mode) => (selectedMode = mode);
	const getVariant = (selectedMode, mode) => (mode === selectedMode ? 'selected' : 'default');

	const modes = [
		['farm', '<b>Farm</b> <br> TODO WAIFV2'],
		['swap', '<b>UToken Swap</b> <br> 254 ETH']
	];
</script>

<p class="font-normal text-center mt-6 text-lg">
	<b>Earn</b>
	WAIFU NFTs and receive our governance token by vesting in WAIFU DAO and becoming a Founder, or convert
	your WAIF to our uToken and vote and earn ETH from our
	<b>unic.ly</b>
	collection.
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

<div class="mt-4">
	<span class="uppercase opacity-80 text-xs font-bold">Your staked WAIFV2:</span>
	<span class="text-sm font-bold">0</span>
</div>

<div class="grid w-[350px] space-y-3 mt-3">
	<Button variant="rounded-black">Claim (500) WAIFU</Button>
	<Button rounded={true} gradient={true}>WAIFU Farming Pool</Button>

	<p class="text-[#1D1D1DB2] pt-2 text-sm">
		Deposit your V1 WAIF or WAIF-ETH UNI-V2 LP tokens to receive bonded WAIFv2 and continue farming
		WAIFU to earn new NFTs.
	</p>

	<a
		href="./choose-method"
		class="font-bold text-sm mt-4 border-b border-px border-black w-min whitespace-nowrap"
	>
		Read more
	</a>
</div>
