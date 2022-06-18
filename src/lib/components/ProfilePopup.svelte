<script>
	import { goto } from '$app/navigation';
	import Disconnect from '$icons/disconnect.svelte';
	import { profileData } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { disconnectWallet } from '$utils/wallet/connectWallet';
	import { slide } from 'svelte/transition';
	import Button from './Button.svelte';

	let showDashboard = false;
	let showMyCollections = false;

	profileData.subscribe((profile) => {
		// Also checking for superadmin just in case a user has the role but was not assigned the admin too
		showDashboard = profile && (profile.roles.includes('admin') || profile.roles.includes('superadmin'));
		showMyCollections = profile && (profile.roles.includes('verified_user') || profile.roles.includes('superadmin'));
	});
</script>

<div id="profile-popup-container" class="absolute bg-white w-72 top-20 right-4 rounded-2xl z-10 px-4 py-4 overflow-hidden" transition:slide>
	<div class="grid gap-2">
		<Button variant="rounded-outline" class="profile-btn-item !w-full !py-2" on:click={() => goto(`/profile/${$currentUserAddress}`)}>My Profile</Button>
		{#if showDashboard}
			<Button variant="rounded-outline" class="profile-btn-item" --width="100%" --py="0.5rem" on:click={() => goto('/admin')}>Dashboard</Button>
		{/if}
		{#if showMyCollections}
			<Button variant="rounded-outline" class="profile-btn-item" --width="100%" --py="0.5rem" on:click={() => goto(`/profile/${$profileData.address}/collections`)}>My Collections</Button>
		{/if}

		<Button variant="rounded-outline" class="profile-btn-item bg-red-200" --width="100%" --py="0.5rem" on:click={() => alert('Not Implemented Yet')}>Buy Hinata</Button>
	</div>

	<div class="h-px bg-color-gray-light my-3" />

	<button class="flex w-full transition-btn profile-btn-item" id="nav-disconnect-btn" on:click={disconnectWallet}>
		<span class="uppercase flex-grow text-left font-semibold">Disconnect</span>
		<Disconnect />
	</button>
</div>

<style>
	#profile-popup-container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}
</style>
