<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Copy from '$icons/copy.svelte';
	import GuestUserAvatar from '$icons/guest-user-avatar.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import AdminTools from '$lib/components/profile/AdminTools.svelte';
	import SocialButton from '$lib/components/SocialButton.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import { profileCompletionProgress, profileData } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { isAdmin } from '$utils/api/login';
	import { fetchProfileData, ProfileData } from '$utils/api/profile';
	import { setPopup } from '$utils/popup';
	import { getFacebookUrl, getInstagramUrl, getTwitterUrl } from '$utils/profile';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import copyTextToClipboard from '$utils/copyTextToClipboard';
	import ProfileProgressPopup from '$lib/components/profile/ProfileProgressPopup.svelte';
	import getUserNfts from '$utils/nfts/getUserNfts';

	// const tabs = ['CREATED NFTS', 'COLLECTED NFTS', 'ACTIVITY', 'FAVORITES'];
	const tabs = ['CREATED NFTS', 'COLLECTED NFTS', 'FAVORITES'];
	let selectedTab = 'CREATED NFTS';

	$: address = $page.params.address;

	const localProfileData = writable<ProfileData>();

	async function fetchData() {
		if (address === $currentUserAddress) {
			profileData.subscribe(localProfileData.set);
			return;
		}

		$localProfileData = await fetchProfileData(address);
	}

	onMount(fetchData);

	function shortenAddress(address: string) {
		return address.substring(0, 3) + '...' + address.substring(address.length - 4);
	}

	$: socialLinks = {
		twitter: getTwitterUrl($localProfileData?.twitter),
		facebook: getFacebookUrl($localProfileData?.facebook),
		instagram: getInstagramUrl($localProfileData?.instagram)
	};

	$: areSocialLinks = Object.values(socialLinks).some((link) => !!link);
	$: firstTimeUser = $profileData?.username.includes('great_gatsby');

	// Display profile completion popup when profile not completed
	$: $profileCompletionProgress !== null &&
		$profileCompletionProgress < 100 &&
		address === $currentUserAddress &&
		setPopup(ProfileProgressPopup);

	let createdNfts: [] = null;
	const fetchCreatedNfts = async () => {
		createdNfts = (await getUserNfts(address)).result.filter((v) => v.token_uri);
	};

	onMount(fetchCreatedNfts);
</script>

<div class="h-72 bg-color-gray-light">
	{#if $localProfileData?.coverUrl}
		<img src={$localProfileData?.coverUrl} alt="User cover." class="h-full w-full object-cover" />
	{/if}
</div>

<div class="mx-auto px-32 max-w-screen-xl relative">
	<!-- Profile image -->
	<div
		class="border-white border-4 w-32 h-32 absolute top-0 transform -translate-y-1/2 rounded-full bg-white
		grid place-items-center shadow"
	>
		{#if $localProfileData?.imageUrl}
			<img src={$localProfileData?.imageUrl} class="rounded-full h-full" alt="User avatar." />
		{:else}
			<GuestUserAvatar />
		{/if}
	</div>

	<div class="flex items-center pt-20">
		<span class="font-semibold text-xl mr-2 text-center w-32">
			{#if $localProfileData?.username}
				{$localProfileData?.username}
			{:else}
				<span class="opacity-50 font-bold whitespace-nowrap">No username</span>
			{/if}
		</span>

		{#if $localProfileData?.status === 'AWAITING_VERIFIED' || $localProfileData?.status === 'VERIFIED'}
			<div class:grayscale={$localProfileData?.status === 'AWAITING_VERIFIED'}>
				<VerifiedBadge />
			</div>
		{/if}
	</div>

	<div class="flex mt-8">
		<!-- Buttons -->
		<div class="flex flex-col gap-3 h-[min-content] w-72 pt-10">
			<Button
				variant="rounded-shadow"
				rounded
				--py="0.5rem"
				--px="1.5rem"
				--width="11rem"
				on:click={() => copyTextToClipboard(address)}
			>
				<div class="flex items-center">
					<div class="flex-grow font-norma">
						{shortenAddress(address)}
					</div>
					<Copy />
				</div>
			</Button>

			{#if address === $currentUserAddress}
				<div in:fade|local>
					<Button
						variant="rounded-shadow"
						rounded
						--py="0.5rem"
						--px="1.5rem"
						--width="11rem"
						on:click={() => goto('/profile/edit')}
					>
						{firstTimeUser ? 'Setup Profile' : 'Edit Profile'}
					</Button>
				</div>
			{/if}
		</div>

		<!-- Bio -->
		<div class="max-w-[600px] flex-grow">
			<div class="font-bold text-color-gray-dark pl-16">BIO</div>
			<p
				class="mt-4 font-semibold h-32 break-words border-l border-r border-opacity-30 border-black px-16"
			>
				{#if $localProfileData?.bio}
					{$localProfileData?.bio}
				{:else}
					<span class="opacity-50 font-bold">No bio.</span>
				{/if}
			</p>
		</div>

		<!-- Social links -->
		<div class="px-16 w-48 overflow-hidden">
			<div class="font-bold text-color-gray-dark whitespace-nowrap">SOCIAL LINKS</div>

			<div class="flex space-x-2 mt-4">
				{#if areSocialLinks}
					{#each Object.entries(socialLinks) as [key, link]}
						{#if link}
							<SocialButton social={key} href={link} />
						{/if}
					{/each}
				{:else}
					<div class="font-bold whitespace-nowrap opacity-50">No social links.</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<div>
	<div class="container mx-auto px-32 mt-16 flex space-x-8 max-w-screen-xl">
		{#each tabs as tab}
			<TabButton on:click={() => (selectedTab = tab)} selected={selectedTab === tab}>
				{tab}
			</TabButton>
		{/each}
	</div>

	<div class="h-px bg-black opacity-30" />

	<div class="max-w-screen-xl mx-auto">
		{#if selectedTab === 'CREATED NFTS'}
			<NftList data={createdNfts} />
		{:else if selectedTab === 'COLLECTED NFTS'}
			<NftList data={[]} />
		{:else if selectedTab === 'ACTIVITY'}
			<NftList data={[]} />
		{:else if selectedTab === 'FAVORITES'}
			<NftList data={[]} />
		{/if}
	</div>
</div>

{#if $isAdmin && localProfileData}
	<AdminTools profileData={$localProfileData} on:requestDataUpdate={fetchData} />
{/if}
