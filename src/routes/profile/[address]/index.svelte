<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GuestUserAvatar from '$icons/guest-user-avatar.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import type { NftCardOptions } from '$interfaces/nftCardOptions';
	import CopyAddressButton from '$lib/components/CopyAddressButton.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import AdminTools from '$lib/components/profile/AdminTools.svelte';
	import ProfileProgressPopup from '$lib/components/profile/ProfileProgressPopup.svelte';
	import SocialButton from '$lib/components/SocialButton.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import { profileCompletionProgress } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { adaptListingToNftCard } from '$utils/adapters/adaptListingToNftCard';
	import { adaptNftDataNftCard } from '$utils/adapters/adaptNftDataToNftCard';
	import { apiNftToNftCard } from '$utils/adapters/apiNftToNftCard';
	import { getListings } from '$utils/api/listing';
	import { apiGetUserNfts } from '$utils/api/nft';
	import { fetchProfileData } from '$utils/api/profile';
	import { userHasRole } from '$utils/auth/userRoles';
	import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
	import { setPopup } from '$utils/popup';
	import { notifyError } from '$utils/toast';
	import type { UserData } from 'src/interfaces/userData';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	const tabs = ['COLLECTED NFTS', 'CREATED NFTS', 'ACTIVE LISTINGS', 'FAVORITES'];
	let selectedTab = 'COLLECTED NFTS';

	$: address = $page.params.address;

	$: if ($page.url.searchParams.has('tab')) {
		let tabName = $page.url.searchParams.get('tab').split('_').join(' ').trim();
		selectedTab = tabName;
	}

	const localProfileData = writable<UserData>();

	async function fetchData(forAdress: string) {
		$localProfileData = await fetchProfileData(forAdress);
	}

	$: browser && fetchData(address);

	$: socialLinks = $localProfileData?.social || { instagram: '', discord: '', twitter: '', website: '', pixiv: '', deviantart: '', artstation: '' };

	$: areSocialLinks = Object.values(socialLinks).some((link) => !!link);
	$: firstTimeUser = $localProfileData?.createdAt === $localProfileData?.updatedAt;

	// Display profile completion popup when profile not completed
	$: $profileCompletionProgress !== null && $profileCompletionProgress < 100 && address === $currentUserAddress && setPopup(ProfileProgressPopup);

	$: console.log(collectedNfts);

	let activeListings: NftCardOptions[] = [];
	let favoriteNfts: NftCardOptions[] = [];

	let totalNfts: number | null = null;
	$: totalNfts;

	let nftsPage = 0;

	let isFetchingNfts = false;

	let collectedNfts = [];
	let createdNfts = [];

	async function fetchNfts() {
		isFetchingNfts = true;

		const res = await apiGetUserNfts(address, nftsPage, 10);

		if (res.err) {
			console.error(res.err);
			notifyError("Failed to fetch user's NFTs.");
			return;
		}

		collectedNfts = res.res.map((nft) => apiNftToNftCard(nft));
		createdNfts = res.res.filter((nft) => nft.creator?.toLowerCase() === address.toLowerCase()).map((nft) => apiNftToNftCard(nft));

		isFetchingNfts = false;
	}

	const fetchActiveListing = async () => {
		const fetchedListings = await getListings();
		activeListings = await Promise.all(fetchedListings.map(adaptListingToNftCard));
	};

	const fetchFavoriteNfts = async (address: string) => {
		const favorites = await getUserFavoriteNfts(address);
		console.log(favorites);
		favoriteNfts = favorites && (await Promise.all(favorites.map((f) => adaptNftDataNftCard(f.nft))));
	};

	onMount(() => {
		fetchNfts();
		fetchActiveListing();
	});

	$: if ($currentUserAddress) {
		fetchFavoriteNfts($currentUserAddress);
	}
</script>

<div class="h-72 bg-color-gray-light">
	{#if $localProfileData?.coverUrl}
		<div style="background-image: url({$localProfileData?.coverUrl})" class="w-full h-full bg-center bg-no-repeat bg-cover" />
	{/if}
</div>

<div class="relative max-w-screen-xl px-32 mx-auto">
	<!-- Profile image -->
	<div class="absolute top-0 grid w-32 h-32 overflow-hidden transform -translate-y-1/2 bg-white border-4 border-white rounded-full shadow place-items-center">
		{#if $localProfileData?.thumbnailUrl}
			<img src={$localProfileData?.thumbnailUrl} class="h-full rounded-full" alt="User avatar." />
		{:else}
			<GuestUserAvatar />
		{/if}
	</div>

	<div class="flex items-center pt-20">
		<span class="w-32 mr-2 text-xl font-semibold text-center whitespace-nowrap">
			{#if $localProfileData?.username}
				{$localProfileData?.username}
			{:else}
				<span class="font-bold opacity-50 whitespace-nowrap">No username</span>
			{/if}

			{#if $localProfileData?.status === 'AWAITING_VERIFIED' || $localProfileData?.status === 'VERIFIED'}
				<div class:grayscale={$localProfileData?.status === 'AWAITING_VERIFIED'} class="inline-block translate-x-1 translate-y-1">
					<VerifiedBadge />
				</div>
			{/if}
		</span>
	</div>

	<div class="flex mt-8">
		<!-- Buttons -->
		<div class="flex flex-col gap-3 h-[min-content] w-72 pt-10">
			<CopyAddressButton {address} />

			{#if address === $currentUserAddress}
				<div transition:fade|local>
					<button class="btn btn-rounded btn-shadow w-[11rem] py-2 uppercase" on:click={() => goto('/profile/edit')}>
						{firstTimeUser ? 'Setup Profile' : 'Edit Profile'}
					</button>
				</div>
			{/if}
		</div>

		<!-- Bio -->
		<div class="max-w-[600px] flex-grow">
			<div class="pl-16 font-bold text-color-gray-dark">BIO</div>
			<p class="h-32 px-16 mt-4 overflow-y-auto font-semibold break-words border-l border-r border-black border-opacity-30">
				{#if $localProfileData?.bio}
					{@html $localProfileData?.bio}
				{:else}
					<span class="font-bold opacity-50">No bio.</span>
				{/if}
			</p>
		</div>

		<!-- Social links -->
		<div class="px-16 overflow-hidden">
			<div class="font-bold text-color-gray-dark whitespace-nowrap">SOCIAL LINKS</div>

			<div class="flex flex-wrap mt-4">
				{#if areSocialLinks}
					{#each Object.entries(socialLinks) as [key, link]}
						{#if link}
							<div class="mb-2 mr-2">
								<SocialButton social={key} href={link} />
							</div>
						{/if}
					{/each}
				{:else}
					<div class="font-bold opacity-50 whitespace-nowrap">No social links.</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<div>
	<div class="container flex max-w-screen-xl px-32 mx-auto mt-16 space-x-8">
		{#each tabs as tab}
			<TabButton on:click={() => (selectedTab = tab)} selected={selectedTab === tab}>
				{tab}
			</TabButton>
		{/each}
	</div>

	<div class="h-px bg-black opacity-30" />

	<div class="max-w-screen-xl mx-auto">
		{#key createdNfts}
			{#if selectedTab === 'COLLECTED NFTS'}
				<NftList options={collectedNfts} isLoading={isFetchingNfts} />
			{:else if selectedTab === 'CREATED NFTS'}
				<NftList options={createdNfts} isLoading={isFetchingNfts} />
			{:else if selectedTab === 'ACTIVE LISTINGS'}
				<NftList options={activeListings} />
			{:else if selectedTab === 'FAVORITES'}
				<NftList options={favoriteNfts} />
			{/if}
		{/key}
	</div>
</div>

{#if $userHasRole('admin', 'superadmin')}
	<AdminTools profileData={$localProfileData} on:requestDataUpdate={() => fetchData(address)} />
{/if}
