<script lang="ts">
	import { browser } from '$app/env';

	import ClaimTokens from '$lib/components/airdrop/ClaimTokens.svelte';
	import ConnectWalletBanner from '$lib/components/airdrop/ConnectWalletBanner.svelte';
	import ProceedStakePopup from '$lib/components/airdrop/ProceedStakePopup.svelte';
	import AirdropDistributionSection from '$lib/sections/AirdropDistributionSection.svelte';
	// import PlatformUsage from '$lib/components/airdrop/PlatformUsage.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import { checkClaimEligibility } from '$utils/contracts/airdropDistribution';
	import { setPopup } from '$utils/popup';

	$: walletConnected = !!$appSigner;

	// Check For eligibility
	$: (async (signer) => {
		return browser && signer && checkClaimEligibility('community', await signer.getAddress());
	})($appSigner);

	$: (async (address) => address && checkClaimEligibility('community', address))(
		$currentUserAddress
	);

	// USAGE
	// setPopup(ProceedStakePopup, { props: { numberOfHinata: 40, duration: '40 days' } });
</script>

<div class="w-full min-h-full px-6">
	<div class="w-full flex justify-center mt-24">
		<img src="/img/logo/airdrop-logo.svg" alt="airdrop logo" />
	</div>

	<div class="w-full text-center mt-9 ">
		<div
			class="text-7xl uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-color-purple to-color-blue"
		>
			Token portal
		</div>

		<!-- Community Airdrop Section -->
		<div class="w-full mt-20 font-bold text-5xl">Community Airdrop</div>

		<div class="text-lg font-bold mt-12">
			The Hinata community airdrop snapshot was taken on December 8th, 2021 at 00:00 UTC
		</div>

		{#if walletConnected}
			<ClaimTokens />
		{:else}
			<ConnectWalletBanner />
		{/if}

		<!-- Platform Usage -->
		<div class="w-full mt-28 font-bold text-5xl">Platform Usage</div>

		<div class="w-full max-w-3xl m-auto mt-16 text-color-black">
			Tokens are distributed among active users on the Hinata Platform. If you made a sale or a
			purchase last week, you've got tokens to claim!
		</div>

		<div
			class="w-full max-w-5xl m-auto bg-black bg-opacity-5 border-4 border-black border-opacity-20 mt-12 py-11 px-7 rounded-2xl"
		>
			<span class="text-lg font-bold text-color-black ">
				Platform usage claims will begin once the app is live.
			</span>
		</div>

		<!-- Removed at Hinata-179 -->
		<!-- <PlatformUsage /> -->

		<!-- Token Distribution -->
		<div class="mb-52">
			<AirdropDistributionSection />
		</div>
	</div>
</div>
