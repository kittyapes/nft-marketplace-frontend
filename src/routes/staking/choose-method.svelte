<script>
	import Circle from './_lib/Circle.svelte';
	import Container from './_lib/Container.svelte';
	import ConvertYourTokens from './_lib/ConvertYourTokens.svelte';
	import Pill from './_lib/Pill.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<Container class="my-32">
	<ConvertYourTokens />

	<div class="flex-grow flex flex-col items-center max-w-xl">
		<Pill />
		<div class="separator mt-4" />

		<p class="font-normal text-center mt-6 text-lg">
			<span class="font-bold">Unstake, migrate</span> to HINATA and continue farming, <br /> or
			<span class="font-bold">convert</span> old rewards.
		</p>

		<div class="flex mt-8 gap-8">
			<Circle text="Unstake" />
			<Circle text="Migrate to Hinata" variant="selected" />
			<Circle text="Convert" />
		</div>

		<div class="separator mt-12" />

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
				allocation for our upcoming NFT ecosystem. Your HINATA tokens will automatically be entered
				into the staking contract and can be withdrawn at anytime.
			</span>

			<a class="text-color-black underline whitespace-nowrap font-bold" href="./choose-method">
				Read more
			</a>
		</p>
	</div>
</Container>

<style>
	.separator {
		width: 100%;
		height: 1px;
		background-color: #1d1d1d4d;
	}
</style>
