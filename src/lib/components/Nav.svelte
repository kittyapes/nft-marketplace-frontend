<script>
	// import Search from './Search.svelte';
	import ProfilePopup from './ProfilePopup.svelte';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { appSigner, connectionDetails, currentUserAddress } from '$stores/wallet';
	import { onMount } from 'svelte';
	import { profileData } from '$stores/user';
	import { fade } from 'svelte/transition';
	import UserCircle from '$icons/user-circle.svelte';
	import { goto } from '$app/navigation';
	import { storage } from '$utils/contracts';
	import { browser } from '$app/env';

	let displayProfilePopup = false;
	let showProfileButton = false;
	const closeModalIfNotInElement = (e) => {
		// Click is not on the profile button or popup element
		if (!e.target.closest('#profile-button') && !e.target.closest('#profile-popup-parent') && !e.target.closest('#profile-popup-container')) {
			displayProfilePopup = false;
		}
		if (e.target.closest('.profile-btn-item')) {
			displayProfilePopup = false;
		}
	};

	onMount(() => {
		window.addEventListener('click', closeModalIfNotInElement);
	});

	$: displayedUsername = $profileData?.username;
	$: profileButtonTitle = displayedUsername?.length > 15 ? displayedUsername : '';

	let imageFailedToLoad = false;

	$: useTestnets = $connectionDetails ? $connectionDetails?.chainId !== 1 : import.meta.env.VITE_DEFAULT_NETWORK !== '1';

	// Create button display logic
	let showCreate = false;

	currentUserAddress.subscribe(async (a) => {
		showCreate = browser && a && (await storage.hasRole('minter', a).catch(() => false));
	});
</script>

<div class="fixed z-10 flex w-full">
	<div class="fixed z-10 flex items-center w-full h-16 pl-8 pr-2 overflow-x-visible bg-white gap-x-8 drop-shadow-lg scrollbar-hidden snap-mandatory snap-x">
		<!-- Logo -->
		<a href="/" class="snap-center min-w-max">
			{#if useTestnets}
				<img src="/svg/logo/logo.testnets.svg" alt="Hinata Testnets logo." />
			{:else}
				<img src="/svg/logo/logo.alpha.svg" alt="Hinata logo." />
			{/if}
		</a>

		<!-- <Search class="snap-start" /> -->

		<!-- Flex filler -->
		<div class="flex-grow" />

		<!-- Marketplace -->
		<a id="marketplace-link" href="/marketplace" class="relative font-semibold text-transparent uppercase text-md bg-gradient-to-r bg-clip-text from-color-purple to-color-blue snap-center">
			Marketplace
		</a>

		<!-- Staking - HIDDEN FOR V1 -->
		<!-- <a href="/stake" class="relative font-semibold uppercase text-md snap-center min-w-fit" class:-mr-8={!showCreate}>Staking</a> -->

		<!-- Airdrop HIDDEN FOR NOW -->
		<!-- <a href="/airdrop" class="relative font-semibold uppercase text-md">Airdrop</a> -->

		<!-- Create -->
		{#if showCreate}
			<button
				on:click={() => goto('/create')}
				class="relative grid h-full px-16 font-semibold text-white uppercase text-md bg-gradient-to-r from-color-purple to-color-blue place-items-center snap-center"
			>
				Create
			</button>
		{/if}

		<!-- Profile -->
		<div class="relative flex items-center h-full">
			{#if showProfileButton || $appSigner}
				<button
					class="flex items-center h-full font-semibold text-md whitespace-nowrap transition-btn w-52"
					id="profile-button"
					class:hidden={!$appSigner}
					on:click={() => (displayProfilePopup = !displayProfilePopup)}
					title={profileButtonTitle}
				>
					<div class="flex-grow" in:fade>
						{#if $profileData?.username}
							{displayedUsername && displayedUsername.length > 15 ? `${displayedUsername.substring(0, 13)}...` : displayedUsername}
						{:else}
							Guest User
						{/if}
					</div>

					<!-- Profile image or guest user icon -->
					<div class="w-8 h-8">
						{#if $profileData?.thumbnailUrl}
							<img
								on:error={() => "this.onerror=null;this.src='/img/png/placeholder-avatar.png';"}
								src={$profileData.thumbnailUrl}
								alt="Current account avatar."
								class="object-cover w-full h-full rounded-full"
							/>
						{:else}
							<div class="text-color-purple" in:fade|local>
								<UserCircle />
							</div>
						{/if}
					</div>
				</button>
			{/if}

			{#if !$appSigner}
				<button
					on:click={async () => await connectToWallet()}
					class="py-3 ml-8 text-sm font-semibold text-white uppercase bg-black rounded-3xl w-52"
					out:fade
					on:outrostart={() => (showProfileButton = false)}
					on:outroend={() => (showProfileButton = true)}
				>
					Connect Wallet
				</button>
			{/if}
		</div>
		<div class="snap-end" />
	</div>
	<div class="" id="profile-popup-parent">
		{#if displayProfilePopup}
			<ProfilePopup />
		{/if}
	</div>
</div>

<!-- <style>
	#marketplace-link::after {
		@apply absolute h-px w-full bg-gradient-to-r from-color-purple to-color-blue;
		@apply left-0 bottom-0;
		content: '';
	}
</style> -->
