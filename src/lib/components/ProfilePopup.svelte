<script>
	import { goto } from '$app/navigation';
	import DisconnectV2 from '$icons/disconnect-v2.svelte';
	import QuestionMarkIcon from '$icons/question-mark-icon.svelte';
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

<div id="profile-popup-container" class="absolute bg-dark-gradient w-[273px] 2xl:w-[341px] top-14 right-0 rounded-none border-gradient z-10 px-4 py-4 overflow-hidden" transition:slide>
	<div class="flex flex-col gap-y-5 2xl:gap-y-6 text-white">
		<button class=" bg-gradient-a hover:bg-main-gradient border-gradient hover:border-0 profile-btn-item !w-full !py-2" on:click={() => goto(`/profile/${$currentUserAddress}`)}>My Profile</button>
		{#if showDashboard}
			<button class=" bg-gradient-a hover:bg-main-gradient border-gradient hover:border-0 profile-btn-item !w-full !py-2" on:click={() => goto('/management')}>Dashboard</button>
		{/if}
		{#if showMyCollections}
			<button class=" bg-gradient-a hover:bg-main-gradient border-gradient hover:border-0 profile-btn-item !w-full !py-2" on:click={() => goto(`/profile/${$profileData.address}/collections`)}>
				My Collections
			</button>
		{/if}

		<button class=" bg-gradient-a hover:bg-main-gradient border-gradient hover:border-0 profile-btn-item !w-full !py-2" on:click={() => alert('Not Implemented Yet')}>Buy Hinata</button>

		<div class="h-px border-gradient border-0 border-t-2" />
		<button class="flex w-full transition-btn profile-btn-item" id="nav-disconnect-btn" on:click={disconnectWallet}>
			<span class="capitalize text-base 2xl:text-xl leading-4 2xl:leading-5 flex-grow text-left font-semibold">Disconnect</span>
			<DisconnectV2 class="w-4 2xl:w-5 h-4 2xl:h-5" />
		</button>
	</div>
</div>

<style>
	#profile-popup-container {
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
	}
</style>
