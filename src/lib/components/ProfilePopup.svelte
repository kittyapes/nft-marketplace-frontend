<script>
	import { goto } from '$app/navigation';
	import DisconnectV2 from '$icons/disconnect-v2.svelte';
	import { profileData, publicProfileData } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { disconnectWallet } from '$utils/wallet/connectWallet';
	import { slide } from 'svelte/transition';
	import PrimaryButton from './v2/PrimaryButton/PrimaryButton.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let showDashboard = false;
	let showMyCollections = false;
	let disconnected = false;

	publicProfileData.subscribe((publicProfile) => {
		// Checking for saved roles since last login present in public profile object
		showMyCollections = publicProfile && (publicProfile.roles.includes('verified_user') || publicProfile.roles.includes('superadmin'));
		showDashboard = publicProfile && (publicProfile.roles.includes('admin') || publicProfile.roles.includes('superadmin'));
	});

	function checkDisconnect() {
		if (!disconnected) return;

		disconnectWallet();
		dispatch('disconnect');

		disconnected = false;
	}
</script>

<div
	id="profile-popup-container"
	class="absolute bg-dark-gradient w-[273px] 2xl:w-[341px] top-14 right-0 rounded-none border-gradient z-10 px-4 py-4 overflow-hidden"
	transition:slide
	on:outroend={checkDisconnect}
>
	<div class="flex flex-col gap-y-5 2xl:gap-y-6 text-white">
		<h1 class="text-2xl">Notifications</h1>

		<PrimaryButton on:click={() => goto(`/profile/${$currentUserAddress}`)}>My Profile</PrimaryButton>

		{#if showDashboard}
			<PrimaryButton on:click={() => goto('/management')}>Dashboard</PrimaryButton>
		{/if}

		{#if showMyCollections}
			<PrimaryButton on:click={() => goto(`/profile/${$publicProfileData.address}/collections`)}>My Collections</PrimaryButton>
		{/if}

		<!-- <PrimaryButton on:click={() => alert('Not Implemented Yet')}>Buy Hinata</PrimaryButton> -->

		<div class="h-px border-gradient border-0 border-t-2" />
		<button class="flex w-full transition-btn profile-btn-item items-center" id="nav-disconnect-btn" on:click={() => (disconnected = true)}>
			<span class="capitalize text-lg leading-5 flex-grow text-left font-semibold">Disconnect</span>
			<DisconnectV2 class="w-5 h-5" />
		</button>
	</div>
</div>

<style>
	#profile-popup-container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}
</style>
