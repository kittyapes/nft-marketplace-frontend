<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Copy from '$icons/copy.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import AdminTools from '$lib/components/profile/AdminTools.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { fetchCreatedNfts } from '$utils/api/fetchCreatedNfts';
	import { isAdmin } from '$utils/api/login';
	import { fetchProfileData, ProfileData } from '$utils/api/profile';
	import { writable } from 'svelte/store';

	const tabs = ['CREATED NFTS', 'COLLECTED NFTS', 'ACTIVITY', 'FAVORITES'];
	let selectedTab = 'CREATED NFTS';

	const { address } = $page.params;

	const profileData = writable<ProfileData>();

	function fetchData() {
		fetchProfileData(address).then(profileData.set);
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

<div class="h-72 bg-[#D8D8D8]" />

<div class="mx-auto px-32 relative">
	<img
		src="https://picsum.photos/id/237/200/200"
		class="rounded-full border-white border-4 w-32 absolute top-0 transform -translate-y-1/2"
		alt="Profile avatar."
	/>

	<div class="flex items-center pt-20">
		<span class="font-semibold text-xl mr-2">
			{#if $profileData?.username}
				{$profileData?.username}
			{:else}
				<span class="opacity-50 font-bold">No username</span>
			{/if}
		</span>

		{#if $profileData?.status === 'AWAITING_VERIFIED' || $profileData?.status === 'VERIFIED'}
			<div class:grayscale={$profileData?.status === 'AWAITING_VERIFIED'}>
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
			<div class="font-bold text-[#757575]">BIO</div>
			<p class="mt-4 font-semibold use-x-separators h-32">
				{$profileData?.bio || 'No bio provided.'}
			</p>
		</div>

		<!-- Social links -->
		<div class="px-16">
			<div class="font-bold text-[#757575] whitespace-nowrap">SOCIAL LINKS</div>

			<div class="flex space-x-2 mt-4">
				<div class="font-semibold whitespace-nowrap">No social links.</div>
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

{#if $isAdmin && profileData}
	<AdminTools profileData={$profileData} on:requestDataUpdate={fetchData} />
{/if}

<!-- <Modal>
	<NftPopup on:close={() => console.log('close popup')} />
</Modal> -->
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
