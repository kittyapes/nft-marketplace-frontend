<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Copy from '$icons/copy.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import NftPopup from '$lib/components/NftPopup.svelte';
	import AdminTools from '$lib/components/profile/AdminTools.svelte';
	import FreeNftPopup from '$lib/components/profile/FreeNFTPopup.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import { profileData } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { fetchCreatedNfts } from '$utils/api/fetchCreatedNfts';
	import { isAdmin } from '$utils/api/login';
	import { fetchProfileData, ProfileData } from '$utils/api/profile';
	import { closePopup } from '$utils/popup';
	import { writable } from 'svelte/store';

	const tabs = ['CREATED NFTS', 'COLLECTED NFTS', 'ACTIVITY', 'FAVORITES'];
	let selectedTab = 'CREATED NFTS';

	const { address } = $page.params;

	const localProfileData = writable<ProfileData>();

	function fetchData() {
		if (address === $currentUserAddress) {
			localProfileData.set($profileData);
			return;
		}

		fetchProfileData(address).then(localProfileData.set);
	}

	browser && fetchData();

	function shortenAddress(address: string) {
		return address.substring(0, 3) + '...' + address.substring(address.length - 4);
	}

	// Temporary
	const emptyListPromise = new Promise<NftData[]>((resolve) => {
		resolve([]);
	});
</script>

<div class="h-72 bg-color-gray-light" />

<div class="mx-auto px-32 relative">
	<div
		class="border-white border-4 w-32 h-32 absolute top-0 transform -translate-y-1/2 rounded-full bg-white
		grid place-items-center"
	>
		{#if false}
			<img src="https://picsum.photos/id/237/200/200" class="rounded-full " alt="Profile avatar." />
		{:else}
			<svg
				class="h-24 w-24 text-color-purple"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1"
					d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		{/if}
	</div>

	<div class="flex items-center pt-20">
		<span class="font-semibold text-xl mr-2">
			{#if $localProfileData?.username}
				{$localProfileData?.username}
			{:else}
				<span class="opacity-50 font-bold">No username</span>
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
			<Button variant="rounded-shadow" rounded --py="0.5rem" --px="1.5rem" --width="10rem">
				<div class="flex items-center">
					<div class="flex-grow font-norma">
						{shortenAddress(address)}
					</div>
					<Copy />
				</div>
			</Button>

			{#if address === $currentUserAddress}
				<Button
					variant="rounded-shadow"
					rounded
					--py="0.5rem"
					--px="1.5rem"
					--width="10rem"
					on:click={() => goto('/profile/edit')}
				>
					Edit Profile
				</Button>
			{/if}
		</div>

		<!-- Bio -->
		<div class="px-16 max-w-[600px]">
			<div class="font-bold text-color-gray-dark">BIO</div>
			<p class="mt-4 font-semibold use-x-separators h-32">
				{#if $localProfileData?.bio}
					{$localProfileData?.bio}
				{:else}
					<span class="opacity-50 font-bold">No bio</span>
				{/if}
			</p>
		</div>

		<!-- Social links -->
		<div class="px-16">
			<div class="font-bold text-color-gray-dark whitespace-nowrap">SOCIAL LINKS</div>

			<div class="flex space-x-2 mt-4">
				<div class="font-bold whitespace-nowrap opacity-50">No social links.</div>
				<!-- <SocialButton social="twitter" href="#" />
				<SocialButton social="facebook" href="#" />
				<SocialButton social="instagram" href="#" /> -->
			</div>
		</div>
	</div>
</div>

<div>
	<div class="container mx-auto px-32 mt-8 flex space-x-8">
		{#each tabs as tab}
			<TabButton on:click={() => (selectedTab = tab)} selected={selectedTab === tab}>
				{tab}
			</TabButton>
		{/each}
	</div>

	<div class="h-px bg-black opacity-30" />

	{#if selectedTab === 'CREATED NFTS'}
		<NftList promise={emptyListPromise} />
	{:else if selectedTab === 'COLLECTED NFTS'}
		<NftList promise={emptyListPromise} />
	{:else if selectedTab === 'ACTIVITY'}
		<NftList promise={emptyListPromise} />
	{:else if selectedTab === 'FAVORITES'}
		<NftList promise={emptyListPromise} />
	{/if}
</div>

{#if $isAdmin && localProfileData}
	<AdminTools profileData={$localProfileData} on:requestDataUpdate={fetchData} />
{/if}

<Modal>
	<FreeNftPopup on:close={closePopup} />
</Modal>

<style lang="postcss">
	.use-x-separators {
		@apply relative;
	}

	.use-x-separators::before {
		@apply bg-black opacity-30 w-px absolute left-[-4rem] top-0 h-full bottom-0 my-auto;
		content: '';
	}

	.use-x-separators::after {
		@apply bg-black opacity-30 w-px absolute right-[-4rem] top-0 h-full bottom-0 my-auto;
		content: '';
	}
</style>
