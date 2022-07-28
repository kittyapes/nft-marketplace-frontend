<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GuestUserAvatar from '$icons/guest-user-avatar.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import type { CardOptions } from '$interfaces/ui';
	import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
	import CopyAddressButton from '$lib/components/CopyAddressButton.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import AdminTools from '$lib/components/profile/AdminTools.svelte';
	import ProfileProgressPopup from '$lib/components/profile/ProfileProgressPopup.svelte';
	import SocialButton from '$lib/components/SocialButton.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import { profileCompletionProgress } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { listingToCardOptions } from '$utils/adapters/listingToCardOptions';
	import { nftToCardOptions } from '$utils/adapters/nftToCardOptions';
	import { getListing, getListings } from '$utils/api/listing';
	import { apiGetUserNfts, getNft } from '$utils/api/nft';
	import { fetchProfileData } from '$utils/api/profile';
	import { userHasRole } from '$utils/auth/userRoles';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';
	import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
	import { setPopup } from '$utils/popup';
	import { notifyError } from '$utils/toast';
	import { isEthAddress } from '$utils/validator/isEthAddress';
	import type { UserData } from 'src/interfaces/userData';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	$: address = $page.params.address;

	onMount(async () => {
		if (!isEthAddress(address)) {
			notifyError('Invalid Ethereum Address');
			setTimeout(() => goto('/404'), 1500);
			return;
		}

		if ($page.url.searchParams.has('id')) {
			const id = $page.url.searchParams.get('id');
			const listing = await getListing(id);

			let options: CardOptions;

			if (listing) {
				options = listingToCardOptions(listing);
			} else {
				const nft = await getNft(id);
				options = nftToCardOptions(nft);
			}

			setPopup(CardPopup, { props: { options }, onClose: () => removeUrlParam('id'), unique: true });
		}
	});

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

	let totalNfts: number | null = null;
	$: totalNfts;

	let tabs: {
		fetchFunction: (tab: any, page: number, limit: number) => Promise<{ res: any; adapted: []; err: Error }>;
		label: string;
		name: string;
		index?: number;
		reachedEnd?: boolean;
		data?: [];
	}[] = [];

	function initTabs() {
		tabs = [
			{
				fetchFunction: async (tab, page, limit) => {
					const res = {} as FetchFunctionResult;
					res.res = await apiGetUserNfts(address, 'COLLECTED', page, limit);
					res.adapted = res.res.res.map(nftToCardOptions);

					for (const nft of res.adapted) {
						nft.rawResourceData.owner = address;
					}

					return res;
				},
				label: 'Collected NFTs',
				name: 'collected'
			},
			{
				fetchFunction: async (tab, page, limit) => {
					const res = {} as FetchFunctionResult;
					res.res = await apiGetUserNfts(address, 'MINTED', page, limit);
					res.adapted = res.res.res.map((nft) => nftToCardOptions(nft));
					return res;
				},
				label: 'Created NFTs',
				name: 'created'
			},
			{
				fetchFunction: async (tab, page, limit) => {
					const res = {} as FetchFunctionResult;
					res.res = await getListings({ seller: address }, page, limit);
					res.adapted = res.res.map(listingToCardOptions);
					return res;
				},
				label: 'Active Listings',
				name: 'listings'
			},
			{
				fetchFunction: async (tab, page, limit) => {
					const res = {} as FetchFunctionResult;
					res.res = await getUserFavoriteNfts(address);
					res.adapted = res.res.map((nft) => nftToCardOptions(nft.nft));

					tab.reachedEnd = true;

					return res;
				},
				label: 'Favorites',
				name: 'favorites'
			}
			// {
			// 	fetchFunction: async (tab, page, limit) => {
			// 		const res = {} as FetchFunctionResult;

			// 		res.res = await apiGetHiddenNfts(address, page, limit);
			// 		res.adapted = res.res.map(nftToCardOptions);

			// 		return res as any;
			// 	},
			// 	label: 'Hidden',
			//  name: 'hidden'
			// }
		];

		tabs.map((t) => {
			t.index = 1;
			t.data = [];
			t.reachedEnd = false;
		});
	}

	let selectedTabName = $page.url.searchParams.get('tab') || 'collected';
	$: selectedTab = tabs.find((t) => t.name === selectedTabName) || tabs[0];

	initTabs();
	$: address, initTabs(), fetchMore();

	let isFetchingNfts = false;

	async function fetchMore() {
		const tab = selectedTab;

		if (tab.reachedEnd) return;

		isFetchingNfts = true;

		const res = await tab.fetchFunction(tab, tab.index, 10);

		if (res.err) {
			console.error(res.err);
			notifyError("Failed to fetch user's NFTs.");
			return;
		}

		if (res.adapted.length === 0) {
			tab.reachedEnd = true;
		} else {
			tab.data = [...tab.data, ...res.adapted];
			tab.index++;
		}

		selectedTab = selectedTab;

		isFetchingNfts = false;
	}

	let cardPropsMapper: (v: CardOptions) => { options: CardOptions } & any;

	$: {
		if (selectedTab.label === 'Collected NFTs') {
			cardPropsMapper = (v: CardOptions) => ({ options: v, menuItems: ['hide'] });
		} else if (selectedTab.label === 'Hidden') {
			cardPropsMapper = (v: CardOptions) => ({ options: v, menuItems: ['reveal'] });
		} else {
			cardPropsMapper = (v) => ({ options: v });
		}
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
			<TabButton
				on:click={() => {
					selectedTab = tab;
					fetchMore();
				}}
				selected={selectedTab === tab}
				uppercase
			>
				{tab.label}
			</TabButton>
		{/each}
	</div>

	<div class="h-px bg-black opacity-30" />

	<div class="max-w-screen-xl mx-auto">
		<NftList options={selectedTab.data} isLoading={isFetchingNfts} on:end-reached={fetchMore} reachedEnd={selectedTab.reachedEnd} {cardPropsMapper} />
	</div>
</div>

{#if $userHasRole('admin', 'superadmin')}
	<AdminTools profileData={$localProfileData} on:requestDataUpdate={() => fetchData(address)} />
{/if}
