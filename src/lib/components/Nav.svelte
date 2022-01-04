<script>
	// import Search from './Search.svelte';
	import ProfilePopup from './ProfilePopup.svelte';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { appSigner } from '$stores/wallet';
	import { onMount } from 'svelte';

	let displayProfilePopup = false;

	const closeModalIfNotInElement = (e) => {
		// Element parent includes the connectButton/Profile
		if (!e.target.closest('#profileButtonParent')) {
			displayProfilePopup = false;
		}
	};

	onMount(() => {
		window.addEventListener('click', closeModalIfNotInElement);
	});
</script>

<div class="flex items-center h-16 px-8 gap-x-8 fixed w-full z-10 bg-white drop-shadow-lg">
	<!-- Logo -->
	<a href="/">
		<img src="/img/logo/logo.svg" alt="Hinata logo." />
	</a>

	<!-- <Search /> -->

	<!-- Flex filler -->
	<div class="flex-grow" />

	<!-- Marketplace -->
	<!-- <a
		id="marketplace-link"
		href="/marketplace"
		class="relative font-semibold text-transparent uppercase text-md bg-gradient-to-r bg-clip-text from-color-purple to-color-blue"
	>
		Marketplace
	</a> -->

	<!-- Staking -->
	<!-- <a href="/staking" class="relative font-semibold uppercase text-md">Staking</a> -->

	<!-- Create -->
	<a
		href="/airdrop"
		class="relative grid h-full px-16 font-semibold text-white uppercase text-md bg-gradient-to-r from-color-purple to-color-blue place-items-center"
	>
		Airdrop
	</a>

	<!-- Profile -->
	<div class="relative">
		<button
			id="profileButtonParent"
			class="text-md font-semibold whitespace-nowrap transition-btn"
			class:hidden={!$appSigner}
			on:click={() => (displayProfilePopup = !displayProfilePopup)}
		>
			Your Name
		</button>

		{#if displayProfilePopup}
			<ProfilePopup />
		{/if}
		<button
			on:click={async () => await connectToWallet()}
			class="rounded-3xl text-white bg-black px-9 py-3 uppercase text-sm font-semibold"
			class:hidden={$appSigner}
		>
			Connect To Wallet
		</button>
	</div>
</div>

<!-- <style>
	#marketplace-link::after {
		@apply absolute h-px w-full bg-gradient-to-r from-color-purple to-color-blue;
		@apply left-0 bottom-0;
		content: '';
	}
</style> -->
