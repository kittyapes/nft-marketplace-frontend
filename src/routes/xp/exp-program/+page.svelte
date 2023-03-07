<script>
	import EthV2 from '$icons/eth-v2.svelte';
	import HinataGlow from '$icons/HinataGlow.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import HorizontalSeparator from '../lib/HorizontalSeparator.svelte';
</script>

<main class="text-white">
	<div class="grid place-items-center mt-12">
		<h1 class="text-gradient text-3xl font-medium text-center">Hinata Airdrop</h1>
	</div>

	<h2 class="mt-12 text-xl uppercase text-center">Take Action - Earn EXP Points - Get Rewards</h2>

	<div class="mt-16 max-w-screen-sm mx-auto">
		<PrimaryButton>View Collections</PrimaryButton>
	</div>

	<div class="mt-16">
		<HorizontalSeparator />
	</div>

	<h3 class="underline text-2xl font-mediu text-center mt-8 font-bold">Trading Volume</h3>

	<div class="font-semibold text-xl mt-1 flex items-center justify-center">
		every .005
		<div class="mx-2">
			<EthV2 />
		</div>
		traded =
		<span class="text-effect-orange ml-2">1 EXP point</span>

		<div class="ml-2">
			<HinataGlow />
		</div>
	</div>

	<h3 class="underline text-2xl font-mediu text-center mt-8 font-semibold">
		EXP for Listing NFT's
	</h3>

	<div>Table</div>

	<div class="mx-auto grid place-items-center mt-8">
		<h2 class="text-gradient text-4xl font-medium">Verified Creators</h2>
	</div>

	<p class="text-center max-w-prose mx-auto mt-4">
		What is a verified creator? A verified creator is a user that applied to on the marketplace to
		receive a verified creator role allowing them to create collections and NFT's on Hinata
		Marketplace.
	</p>

	<div class="mt-12 max-w-screen-sm mx-auto">
		<PrimaryButton>Apply to be a Verified Creator</PrimaryButton>
	</div>

	<div class="grid grid-cols-3 mt-16 mb-32">
		<div class="text-lg uppercase font-semibold text-center">
			<div>Verified Creator Mints</div>
			<div class="text-sm font-semibold opacity-0 select-none">Consistent padding :)</div>
			<div class="text-effect-orange mt-6">500 EXP</div>
		</div>

		<div class="flex flex-col items-center">
			<div class="uppercase text-lg font-semibold">Verified Creator Sales</div>
			<div class="text-sm font-semibold">(For NFT's created on Hinata)</div>

			<div class="font-semibold text-xl flex items-center justify-center mt-6">
				every .005
				<div class="mx-2">
					<EthV2 />
				</div>
				traded =
				<span class="text-effect-orange ml-2">1 EXP point</span>
			</div>
		</div>

		<div class="flex flex-col items-center text-center">
			<div class="uppercase text-lg font-semibold">Verified Creator Listing</div>
			<div class="text-sm font-semibold">(For NFT's created on Hinata)</div>

			<div class="text-effect-blue mt-6">50 EXP</div>
		</div>
	</div>
</main>
