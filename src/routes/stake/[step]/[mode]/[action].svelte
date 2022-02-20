<script>
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ActionSelect from '$lib/components/staking/ActionSelect.svelte';
	import Container from '$lib/components/staking/Container.svelte';
	import LeftPane from '$lib/components/staking/LeftPane.svelte';
	import Pill from '$lib/components/staking/Pill.svelte';

	let mode = $page.params.mode;
	let action = $page.params.action;

	$: browser && goto(`/stake/step-1/${mode}/${action}`);

	const modes = {
		v1: {
			strokedText: 'Convert <br> your',
			gradientText: 'Tokens',
			description: `<strong>Unstake, migrate</strong> to HINATA and continue farming, <br /> or <strong>convert</strong> old rewards.`,
			actions: [
				['unstake', 'Unstake'],
				['migrate-to-hinata', 'Migrate to Hinata'],
				['convert', 'Convert']
			]
		},
		hinata: {
			strokedText: 'Earn <br> your',
			gradientText: 'NFTs',
			description: `<b>Earn</b> WAIFU NFTs and receive our governance token by vesting in WAIFU DAO and becoming a Founder, or convert your WAIF to our uToken and vote and earn ETH from our <b>unic.ly</b> collection.`,
			actions: [
				['farm', '<b>Farm</b> <br> TODO WAIFV2'],
				['swap', '<b>UToken Swap</b> <br> 254 ETH']
			]
		}
	};

	$: console.log(`${mode} mode`);
</script>

<Container class="my-32">
	<div class="w-1/2">
		<LeftPane {...modes[mode] || {}} />
	</div>

	<div class="flex-grow flex flex-col items-center max-w-xl">
		<Pill bind:mode />

		<div class="w-full h-px bg-[#1d1d1d4d] mt-4" />

		<ActionSelect description={modes[mode].description} actions={modes[mode].actions} bind:action />

		<hr class="separator w-full mt-12 mb-4" />

		{#if mode === 'v1'}
			<div class="font-bold mt-4">
				<span class="text-sm">0</span>
				<span class="uppercase text-xs opacity-80 ml-1">WAIF has been burned in migration</span>
			</div>

			<div class="w-72 grid mt-4">
				<button class="btn btn-gradient btn-rounded uppercase font-semibold py-4 text-sm">
					Waifu Farming Pool
				</button>
			</div>

			<p class="text-color-black w-[25rem] mt-6 text-sm">
				<span class="opacity-70">
					Continue farming and become a Founder of Hinata DAO by migrating and vesting your WAIF or
					LP tokens to Hinata. This is your ticket to exclusive drops, community votes, and an early
					allocation for our upcoming NFT ecosystem. Your HINATA tokens will automatically be
					entered into the staking contract and can be withdrawn at anytime.
				</span>

				<a class="text-color-black underline whitespace-nowrap font-bold" href="./choose-method">
					Read more
				</a>
			</p>
		{:else}
			<div class="mt-4">
				<span class="uppercase opacity-80 text-xs font-bold">Your staked WAIFV2:</span>
				<span class="text-sm font-bold">0</span>
			</div>

			<div class="grid w-[350px] space-y-3 mt-3">
				<button class="btn btn-rounded btn-black text-sm font-semibold py-4 uppercase">
					Claim (500) WAIFU
				</button>
				<button class="btn btn-rounded btn-gradient text-sm font-semibold py-4 uppercase">
					WAIFU Farming Pool
				</button>

				<p class="text-[#1D1D1DB2] pt-2 text-sm">
					Deposit your V1 WAIF or WAIF-ETH UNI-V2 LP tokens to receive bonded WAIFv2 and continue
					farming WAIFU to earn new NFTs.
				</p>

				<a
					href="./choose-method"
					class="font-bold text-sm mt-4 border-b border-px border-black w-min whitespace-nowrap"
				>
					Read more
				</a>
			</div>
		{/if}
	</div>
</Container>
