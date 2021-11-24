<script>
	import RoundedButton from '../RoundedButton.svelte';
	import { fade } from 'svelte/transition';
</script>

<div
	class="w-full max-w-3xl m-auto bg-black bg-opacity-5 container border-4 border-black px-4 border-opacity-20 mt-12 py-11 rounded-2xl"
	in:fade
>
	<div class="w-full max-w-md m-auto text-left">
		<div class="text-4xl text-color-black font-bold">Claim your tokens</div>

		<div class="mt-7">
			Your ethereum account is eligible for this airdrop. Please claim your tokens below by
			submitting a transaction which will pull them to your wallet
		</div>

		<div class="font-bold uppercase mt-7">YOU WILL RECIEVE...</div>

		<div class="w-full flex flex-col gap-4 mt-5">
			<div class="w-full flex items-center justify-center gap-7">
				<span class="font-bold tracking-wider">67,172 HINATA TOKENS</span>
				<div class="flex-grow-0 ">
					<RoundedButton bgColor="from-color-purple to-color-blue"
						><div class="px-6">CLAIM</div></RoundedButton
					>
				</div>
			</div>

			<div class="w-full flex items-center justify-center gap-7">
				<span class="font-bold tracking-wider">14,204 HINATA TOKENS</span>
				<div class="flex-grow-0 ">
					<RoundedButton bgColor="from-gray-300 to-transparent"
						><div class="px-6 text-black">Escrowed</div></RoundedButton
					>
				</div>
			</div>

			<div class="w-full flex items-center justify-center gap-7">
				<div class="font-bold uppercase">Escrow is Unlocked In...</div>
				<div class="text-xl font-bold">29D, 4H, 17M</div>
			</div>
		</div>
	</div>

	<!-- horizontal line -->
	<div class="w-full h-px bg-black bg-opacity-20 mt-7" />

	<div class="w-full max-w-md m-auto text-left mt-12">
		<div class="font-bold uppercase mt-7 text-left">Your wallet balance</div>

		<div class="w-full flex flex-col gap-4 mt-5">
			<div class="w-full flex items-center justify-center gap-7 ">
				<span class="font-bold tracking-wider">67,172 HINATA TOKENS</span>
				<div class="flex-grow-0 ">
					<RoundedButton bgColor="from-color-purple to-color-blue">
						<div class="px-6">STAKE</div>
					</RoundedButton>
				</div>
			</div>
		</div>

		<div class="flex gap-6 mt-7 items-center">
			<div class="uppercase text-left">lockup period</div>

			<div class="bg-white rounded-lg flex font-bold">
				<div class="py-2 px-5 border-r-2">3MO</div>
				<div class="py-2 px-5 border-r-2 text-color-blue">1YR</div>
				<div class="py-2 px-5">2YR</div>
			</div>
		</div>

		<div class="mt-7">
			You can deposit your tokens to the vault to earn governance rewards and become a DAO member
		</div>
	</div>
</div>
