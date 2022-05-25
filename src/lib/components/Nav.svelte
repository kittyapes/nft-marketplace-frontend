<script>
	import Search from './Search.svelte';
	import ProfilePopup from './ProfilePopup.svelte';
	import { connectToWallet } from '$utils/wallet/connectWallet';
	import { appSigner } from '$stores/wallet';
	import { onMount } from 'svelte';
	import { profileData } from '$stores/user';
	import { fade } from 'svelte/transition';
	import UserCircle from '$icons/user-circle.svelte';
	import { goto } from '$app/navigation';

	let displayProfilePopup = false;
	let showProfileButton = false;

	const closeModalIfNotInElement = (e) => {
		// Element parent includes the connectButton/Profile
		if (!e.target.closest('#profileButtonParent')) {
			displayProfilePopup = false;
		}
	};

	onMount(() => {
		window.addEventListener('click', closeModalIfNotInElement);
	});

	// had to be changed to get rid of great_gatsby, needs further improvements
	/*$: displayedUsername = $profileData?.username.includes('great_gatsby') ? 'Guest User' : $profileData?.username;*/
	$: displayedUsername = $profileData?.username;

	$: profileButtonTitle = displayedUsername?.length > 15 ? displayedUsername : '';
	let imageFailedToLoad = false;

	let showCreate = false;

	profileData.subscribe((profile) => {
		showCreate = profile && (profile.status === 'VERIFIED' || profile.roles.includes('superadmin'));
	});
</script>

<div class="flex items-center h-16 pl-8 gap-x-8 fixed w-full z-10 bg-white drop-shadow-lg">
	<!-- Logo -->
	<a href="/">
		<img src="/img/logo/logo.svg" alt="Hinata logo." />
	</a>

	<Search />

	<!-- Flex filler -->
	<div class="flex-grow" />

	<!-- Marketplace -->
	<a id="marketplace-link" href="/marketplace" class="relative font-semibold text-transparent uppercase text-md bg-gradient-to-r bg-clip-text from-color-purple to-color-blue">Marketplace</a>

	<!-- Staking -->
	<a href="/stake" class="relative font-semibold uppercase text-md" class:-mr-8={!showCreate}>Staking</a>

	<!-- Airdrop HIDDEN FOR NOW -->
	<!-- <a href="/airdrop" class="relative font-semibold uppercase text-md">Airdrop</a> -->

	<!-- Create -->
	{#if showCreate}
		<button on:click={() => goto('/create')} class="relative grid h-full px-16 font-semibold text-white uppercase text-md bg-gradient-to-r from-color-purple to-color-blue place-items-center">
			Create
		</button>
	{/if}

	<!-- Profile -->
	<div class="relative h-full flex items-center pr-4">
		{#if showProfileButton}
			<button
				id="profileButtonParent"
				class="text-md font-semibold whitespace-nowrap transition-btn w-52 h-full
				flex items-center"
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
				<div class="w-6 h-6">
					{#if $profileData?.thumbnailUrl}
						<img
							on:error={() => "this.onerror=null;this.src='/img/png/placeholder-avatar.png';"}
							src={$profileData.thumbnailUrl}
							alt="Current account avatar."
							class="w-full h-full object-cover rounded-full"
						/>
					{:else}
						<div class="text-color-purple" in:fade>
							<UserCircle />
						</div>
					{/if}
				</div>
			</button>
		{/if}

		{#if displayProfilePopup}
			<ProfilePopup />
		{/if}

		{#if !$appSigner}
			<button
				on:click={async () => await connectToWallet()}
				class="rounded-3xl text-white bg-black py-3 uppercase text-sm font-semibold w-52 ml-8"
				out:fade
				on:outrostart={() => (showProfileButton = false)}
				on:outroend={() => (showProfileButton = true)}
			>
				Connect Wallet
			</button>
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
