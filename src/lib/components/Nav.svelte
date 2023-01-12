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

<div class="fixed z-10 flex w-full ">
	<div class="{scrollY ? 'backdrop-blur-xl' : ''} fixed z-10 flex items-center w-full h-20 px-36 overflow-x-visible scrollbar-hidden snap-mandatory snap-x text-white bg">
		<!-- Logo -->
		<a href="/" class="snap-center min-w-max">
			<img src="/svg/logo/logo.v2.svg" alt="Hinata logo." />
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
		{#if $publicProfileData?.roles.includes('verified_user') || $profileData?.roles.includes('superadmin')}
			<button on:click={() => goto('/create')} class="relative font-semibold bg-card-gradient h-1/2 grid place-items-center px-4 snap-center">Create</button>
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
						<div class="w-10 h-10 gradient-border !border-2 flex items-center justify-center">
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
