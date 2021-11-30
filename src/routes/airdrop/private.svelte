<script>
	import RoundedButton from '$lib/components/RoundedButton.svelte';
</script>

<div class="w-full px-6 min-h-screen">
	<div class="w-full flex justify-center mt-24">
		<img src="/img/logo/airdrop-logo.svg" alt="airdrop logo" />
	</div>

	<div class="w-full text-center mt-9 ">
		<div
			class="text-7xl uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue"
		>
			Private investor portal
		</div>
	</div>

	<div
		class="w-full max-w-5xl mx-auto my-24 bg-color-black bg-opacity-5 border-2 rounded-2xl border-color-black border-opacity-10"
	>
		<!-- First row -->
		<div class="flex flex-row border-b-2 border-color-black border-opacity-10">
			<!-- Top Left Box -->
			<div
				class="w-2/5 p-14 text-color-black text-2xl border-r-2 border-color-black border-opacity-10"
			>
				<div class=" opacity-80 font-bold ">Wallet Allocation</div>
				<div class="mt-6">Seed</div>
				<div class="font-bold">0 HiNATA</div>
			</div>

			<!-- Top right box -->
			<div class="w-auto p-14">
				<div class="text-bold text-color-black text-4xl font-bold">Claim your tokens</div>
				<div class="mt-7">Escow unlocks occur at the end of every quarter</div>

				<div class="w-full grid grid-cols-2 grid-rows-3 mt-7 gap-x-14 gap-y-6">
					<div class="uppercase font-bold text-xs self-center">Next escrow unlock is...</div>
					<div class="font-bold text-xl self self-center">29D, 4H, 17M</div>

					<div class="uppercase font-bold self-center">0 HINATA TOKENS</div>
					<div><RoundedButton bgColor="from-color-purple to-color-blue">CLAIM</RoundedButton></div>

					<div class="uppercase font-bold self-center">0 HINATA TOKENS</div>
					<div>
						<RoundedButton bgColor="from-gray-300 to-transparent">Escrowed</RoundedButton>
					</div>
				</div>
			</div>
		</div>

		<!-- Second row -->
		<div class="flex flex-row ">
			<!-- Bottom Left Box -->
			<div
				class="w-2/5 p-14 text-color-black text-2xl border-r-2 border-color-black border-opacity-10"
			>
				<div class="mt-6">Private</div>
				<div class="font-bold">150,000 HiNATA</div>
			</div>

			<!-- Bottom right box -->
			<div class="w-auto p-14">
				<div class="w-full grid grid-cols-2 grid-rows-3 mt-7 gap-x-14 gap-y-6">
					<div class="uppercase font-bold self-center">0 HINATA TOKENS</div>
					<div><RoundedButton bgColor="from-color-purple to-color-blue">CLAIM</RoundedButton></div>

					<div class="uppercase font-bold self-center">0 HINATA TOKENS</div>
					<div>
						<RoundedButton bgColor="from-gray-300 to-transparent">Escrowed</RoundedButton>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
