<script>
	import Search from '$components/v2/Search/+page.svelte';
	import ProfilePopup from './ProfilePopup.svelte';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { appSigner, connectionDetails } from '$stores/wallet';
	import { onMount } from 'svelte';
	import { profileData, publicProfileData } from '$stores/user';
	import { fade } from 'svelte/transition';
	import UserCircle from '$icons/user-circle.svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import Wallet from '$icons/wallet.svelte';

	export let scrollY;

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

	function handleDisconnect() {
		displayProfilePopup = false;
		showProfileButton = false;
	}

	beforeNavigate(() => (displayProfilePopup = false));

	// $: useTestnets = $connectionDetails ? $connectionDetails?.chainId !== 1 : import.meta.env.VITE_DEFAULT_NETWORK !== '1';
</script>

<div class="fixed z-10 flex w-full">
	<div class="{scrollY ? 'backdrop-blur-xl' : ''} fixed z-10 flex items-center w-full h-20 px-36 text-white bg max-w-screen-fhd left-1/2 -translate-x-1/2 ">
		<!-- Logo -->
		<a href="/" class="snap-center min-w-max">
			<img src="/svg/logo/logo.v2.svg" alt="Hinata logo." />
		</a>

		<Search class="snap-start ml-20 w-[45%] h-1/2" />

		<!-- Flex filler -->
		<div class="flex-grow" />

		<!-- Marketplace -->
		<a id="marketplace-link" href="/marketplace/listings" class="nav-button bg-card-gradient">
			Marketplace
			<div class="absolute inset-0 gradient-border animate-gradient-border-spin" />
		</a>

		<!-- Staking - HIDDEN FOR V1 -->
		<!-- <a href="/staking" class="nav-button bg-card-gradient">
			Staking
			<div class="absolute inset-0 gradient-border animate-gradient-border-spin" />
		</a> -->

		<!-- Airdrop HIDDEN FOR NOW -->
		<!-- <a href="/airdrop" class="relative font-semibold uppercase text-md">Airdrop</a> -->

		<!-- Create -->
		{#if $publicProfileData?.roles.includes('verified_user') || $profileData?.roles.includes('superadmin')}
			<button on:click={() => goto('/create')} class="nav-button bg-card-gradient">
				Create
				<div class="absolute inset-0 gradient-border animate-gradient-border-spin" />
			</button>
		{/if}

		<!-- Profile -->
		<div class="relative flex items-center h-full ml-8">
			{#if (showProfileButton || $appSigner) && !showProfileButton}
				<div class="relative w-10 ">
					<button
						class="flex items-center h-full font-semibold text-md whitespace-nowrap transition-btn w-10"
						id="profile-button"
						on:click={() => (displayProfilePopup = !displayProfilePopup)}
						title={profileButtonTitle}
					>
						<!-- Profile image or guest user icon -->
						<div class="w-10 h-10 gradient-border !border-2 flex items-center justify-center relative">
							{#if $publicProfileData?.thumbnailUrl}
								<img
									on:error={() => "this.onerror=null;this.src='/img/png/placeholder-avatar.png';"}
									src={$publicProfileData.thumbnailUrl}
									alt="Current account avatar."
									class="object-cover w-full h-full"
								/>
							{:else}
								<div class="text-color-purple flex items-center justify-center" in:fade|local>
									<UserCircle />
								</div>
							{/if}
							<div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
						</div>
					</button>
					<div class="" id="profile-popup-parent">
						{#if displayProfilePopup}
							<ProfilePopup on:disconnect={handleDisconnect} />
						{/if}
					</div>
				</div>
			{/if}

			{#if !$appSigner}
				<button on:click={async () => await connectToWallet()}>
					<Wallet class="w-10 h-10" />
				</button>
			{/if}
		</div>
		<div class="snap-end" />
	</div>
</div>

<style type="postcss">
	.nav-button {
		@apply relative font-semibold h-1/2 grid place-items-center px-4 snap-center w-32;
	}

	.nav-button:not(:hover) > div {
		display: none;
	}

	.nav-button:active > div {
		display: none;
	}

	.nav-button:active {
		@apply border-none animate-none;

		background-image: linear-gradient(
				10deg,
				rgba(167, 148, 255, 0) 11.15%,
				rgba(167, 148, 255, 0.93) 57.47%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(142, 119, 247, 0) 127.41%,
				rgba(167, 148, 255, 0) 127.41%
			),
			linear-gradient(0deg, #67d4f8, #67d4f8) !important;
	}
</style>
