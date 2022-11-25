<script>
	import Search from '$components/v2/Search/+page.svelte';
	import ProfilePopup from './ProfilePopup.svelte';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { appSigner, connectionDetails } from '$stores/wallet';
	import { onMount } from 'svelte';
	import { publicProfileData, profileData } from '$stores/user';
	import { fade } from 'svelte/transition';
	import UserCircle from '$icons/user-circle.svelte';
	import { goto } from '$app/navigation';

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

	$: displayedUsername = $publicProfileData?.username;
	$: profileButtonTitle = displayedUsername?.length > 15 ? displayedUsername : '';

	$: useTestnets = $connectionDetails ? $connectionDetails?.chainId !== 1 : import.meta.env.VITE_DEFAULT_NETWORK !== '1';
</script>

<div class="fixed z-10 flex w-full ">
	<div class="fixed z-10 flex items-center w-full h-20 pl-8 pr-2 overflow-x-visible scrollbar-hidden snap-mandatory snap-x navbar text-white">
		<!-- Logo -->
		<a href="/" class="snap-center min-w-max">
			{#if useTestnets}
				<img src="/svg/logo/logo.testnets.svg" alt="Hinata Testnets logo." />
			{:else}
				<img src="/svg/logo/logo.alpha.svg" alt="Hinata logo." />
			{/if}
		</a>

		<Search class="snap-start mx-20 w-full" />

		<!-- Flex filler -->
		<div class="flex-grow" />

		<!-- Marketplace -->
		<a id="marketplace-link" href="/marketplace/collections" class="relative font-semibold snap-center bg-card-gradient h-1/2 grid place-items-center px-4 btn">Marketplace</a>

		<!-- Staking - HIDDEN FOR V1 -->
		<a href="/staking" class="relative font-semibold text-md snap-center min-w-fit bg-card-gradient h-1/2 px-4 grid place-items-center">Staking</a>

		<!-- Airdrop HIDDEN FOR NOW -->
		<!-- <a href="/airdrop" class="relative font-semibold uppercase text-md">Airdrop</a> -->

		<!-- Create -->
		{#if $profileData?.roles.includes('verified_user')}
			<button on:click={() => goto('/create')} class="relative font-semibold bg-card-gradient h-1/2 grid place-items-center px-4 snap-center">Create</button>
		{/if}

		<!-- Profile -->
		<div class="relative flex items-center h-full ml-8">
			{#if showProfileButton || $appSigner}
				<button
					class="flex items-center h-full font-semibold text-md whitespace-nowrap transition-btn w-32"
					id="profile-button"
					class:hidden={!$appSigner}
					on:click={() => (displayProfilePopup = !displayProfilePopup)}
					title={profileButtonTitle}
				>
					<!-- Profile image or guest user icon -->
					<div class="w-10 h-10 gradient-border !border-2">
						{#if $publicProfileData?.thumbnailUrl}
							<img
								on:error={() => "this.onerror=null;this.src='/img/png/placeholder-avatar.png';"}
								src={$publicProfileData.thumbnailUrl}
								alt="Current account avatar."
								class="object-cover w-full h-full"
							/>
						{:else}
							<div class="text-color-purple grid place-items-center" in:fade|local>
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

<style type="postcss">
	/* #marketplace-link::after {
		@apply absolute h-px w-full bg-gradient-to-r from-color-purple to-color-blue;
		@apply left-0 bottom-0;
		content: '';
	} */

	.navbar {
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
	}
</style>
