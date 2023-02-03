<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GuestUserAvatar from '$icons/guest-user-avatar.svelte';
	import ShareV2 from '$icons/share-v2.svelte';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import type { CardOptions } from '$interfaces/ui';
	import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import { slide } from 'svelte/transition';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import AdminTools from '$lib/components/profile/AdminTools.svelte';
	import ProfileProgressPopup from '$lib/components/profile/ProfileProgressPopup.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { profileCompletionProgress, profileData, userCreatedListing } from '$stores/user';
	import { listingToCardOptions, nftToCardOptions } from '$utils/adapters/cardOptions';
	import { getListing, getListings } from '$utils/api/listing';
	import { apiGetUserNfts, apiGetUserOwnedNftsAlchemy, getNft } from '$utils/api/nft';
	import { fetchProfileData } from '$utils/api/profile';
	import { apiGetHiddenNfts } from '$utils/api/user';
	import { userHasRole } from '$utils/auth/userRoles';
	import { storage } from '$utils/contracts';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';
	import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
	import { setPopup } from '$utils/popup';
	import { notifyError } from '$utils/toast';
	import { isEthAddress } from '$utils/validator/isEthAddress';
	import type { UserData } from 'src/interfaces/userData';
	import { onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { currentUserAddress } from '$stores/wallet';
	import Twitter from '$icons/socials/twitter.svelte';
	import Instagram from '$icons/socials/instagram.svelte';
	import Web from '$icons/socials/web.svelte';
	import Deviantart from '$icons/socials/deviantart.svelte';
	import Artstation from '$icons/socials/artstation.svelte';
	import SocialCopy from '$icons/socials/social-copy.svelte';
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import { copyUrlToClipboard } from '$utils/misc/clipboard';
	import Pixiv from '$icons/socials/pixiv.svelte';
	import Discord from '$icons/socials/discord.svelte';
	import { fetchIsFollowing, followUnfollowUser } from '$utils/api/following';

	$: address = $page.params.address;
	let isFollowing = false;

	$: if (browser && address && $currentUserAddress) {
		browser && fetchFollowing();
	}

	const fetchFollowing = async () => {
		isFollowing = await fetchIsFollowing(address, $currentUserAddress);
	};

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
				options = await listingToCardOptions(listing);
			} else {
				const nft = await getNft(id);
				options = await nftToCardOptions(nft);
			}

			setPopup(CardPopup, { props: { options }, onClose: () => removeUrlParam('id'), unique: true });
		}
	});

	const fetchLimit = 10;

	const localProfileData = writable<UserData>();

	async function fetchData(forAdress: string) {
		$localProfileData = await fetchProfileData(forAdress);
	}

	$: browser && fetchData(address);

	$: if (browser && address && $currentUserAddress) {
		refreshAllTabs();
	}

	$: if (browser && $currentUserAddress && address && $profileData) {
		selectTab($tabParam);
	}

	userCreatedListing.subscribe((value) => {
		if (value) {
			refreshAllTabs();
			userCreatedListing.set(false);
		}
	});

	$: socialLinks = $localProfileData?.social || { instagram: '', discord: '', twitter: '', website: '', pixiv: '', deviantart: '', artstation: '' };

	$: areSocialLinks = Object.values(socialLinks).some((link) => !!link);
	$: firstTimeUser = $profileData?.createdAt === $profileData?.updatedAt;

	$: console.log($localProfileData);

	// Display profile completion popup when profile not completed
	$: $profileCompletionProgress !== null && $profileCompletionProgress < 100 && address === $currentUserAddress && setPopup(ProfileProgressPopup);

	let totalNfts: number | null = null;
	$: totalNfts;

	let shareButtonOpen = false;
	let elemOpen: HTMLDivElement;
	let elemOpenBtn: HTMLDivElement;

	const tabs: {
		fetchFunction: (tab: any, page: number, limit: number) => Promise<{ res: any; adapted: []; err: Error }>;
		label: string;
		name: string;
		index?: number;
		reachedEnd?: boolean;
		isFetching?: boolean;
		isAlchemyTab: boolean;
		alchemyPageKey?: string;
		data?: CardOptions[];
	}[] = [
		{
			fetchFunction: async (tab, page, limit) => {
				const res = {} as FetchFunctionResult;
				res.res = await apiGetUserOwnedNftsAlchemy(address, tab.alchemyPageKey ?? undefined);
				res.adapted = await Promise.all(res.res.res.nfts.map(nftToCardOptions));
				tab.alchemyPageKey = res.res.res.pageKey;

				for (const nft of res.adapted) {
					nft.rawResourceData.owner = address;
				}

				return res;
			},
			label: 'Collected NFTs',
			name: 'collected',
			isAlchemyTab: true,
		},
		{
			fetchFunction: async (tab, page, limit) => {
				const res = {} as FetchFunctionResult;
				res.res = await apiGetUserNfts(address, 'MINTED', page, limit);
				res.adapted = await Promise.all(res.res.res.nfts.map((nft) => nftToCardOptions(nft)));
				return res;
			},
			label: 'Created NFTs',
			name: 'created',
			isAlchemyTab: false,
		},
		{
			fetchFunction: async (tab, page, limit) => {
				const listingStatus = ['UNLISTED', 'ACTIVE'] as any;

				if ($currentUserAddress === address || $userHasRole('admin', 'superadmin')) {
					listingStatus.push('EXPIRED');
				}

				const res = {} as FetchFunctionResult;
				res.res = await getListings({ seller: address, listingStatus }, page, limit);
				res.adapted = await Promise.all(res.res.map(listingToCardOptions));

				return res;
			},
			label: 'Listings',
			name: 'listings',
			isAlchemyTab: false,
		},
		{
			fetchFunction: async (tab, page, limit) => {
				const res = {} as FetchFunctionResult;
				res.res = await getUserFavoriteNfts(address, page, limit);
				res.adapted = await Promise.all(res.res.map((nft) => nftToCardOptions(nft.nft)));

				return res;
			},
			label: 'Favorites',
			name: 'favorites',
			isAlchemyTab: false,
		},
		{
			fetchFunction: async (tab, page, limit) => {
				const res = {} as FetchFunctionResult;

				res.res = await apiGetHiddenNfts(address, page, limit);
				res.adapted = await Promise.all(res.res.map(nftToCardOptions));

				res.adapted.forEach((i) => (i.allowTrade = false));

				return res as any;
			},
			label: 'Hidden',
			name: 'hidden',
			isAlchemyTab: false,
		},
	];

	function resetTabs() {
		tabs.forEach((t) => {
			t.index = 1;
			t.data = [];
			t.reachedEnd = false;
			t.isFetching = false;
		});
	}

	// Reset tabs on the initial load
	resetTabs();

	const refreshTab = (name: string) => {
		const tab = tabs.find((t) => t.name === name);

		if (!tab) return;

		tab.index = 1;
		tab.data = [];
		tab.reachedEnd = false;

		fetch();
	};

	let refreshNftTabs = (event: CustomEvent) => {
		if (!event.detail) return;

		event.detail.tabs.forEach((tabName) => {
			refreshTab(tabName);
		});
	};

	const refreshAllTabs = () => {
		tabs.forEach((t) => {
			refreshTab(t.name);
		});
	};

	let selectedTab: typeof tabs[0] = tabs[0];

	function selectTab(name: string) {
		if (browser && name && $tabParam !== name) {
			goto('?tab=' + name, { noscroll: true, replaceState: false });
		}

		selectedTab = tabs.find((i) => i.name === name) || tabs.find((t) => t.name === 'collected');

		fetch();
	}

	function fetch() {
		if (browser && !selectedTab.data.length && !selectedTab.isFetching && !selectedTab.reachedEnd) {
			fetchMore();
		}
	}

	const tabParam = derived(page, (p) => p.url.searchParams.get('tab'));

	let isFetchingNfts = false;

	async function fetchMore() {
		const tab = selectedTab;

		if (tab.reachedEnd) return;

		isFetchingNfts = true;
		tab.isFetching = true;
		const res = await tab.fetchFunction(tab, tab.index as number, fetchLimit);

		if (res.err) {
			console.error(res.err);
			notifyError("Failed to fetch user's NFTs.");
			return;
		}

		if (res.adapted.length === 0 && !tab.isAlchemyTab) {
			tab.reachedEnd = true;
		} else {
			tab.data = [...tab.data, ...res.adapted];
			if (tab.isAlchemyTab) {
				tab.reachedEnd = typeof tab.alchemyPageKey === 'string' ? false : true;
			} else {
				(tab.index as number)++;
			}
		}

		selectedTab.data = selectedTab.data;

		isFetchingNfts = false;
		tab.isFetching = false;
	}

	function handleReachedEnd() {
		if (selectedTab.data.length) {
			fetchMore();
		}
	}

	let displayedTabs: string[];

	$: {
		displayedTabs = ['collected', 'created', 'listings', 'favorites'];

		if (address === $currentUserAddress) {
			displayedTabs.push('hidden');
		}

		displayedTabs = displayedTabs;
	}

	let cardPropsMapper: (v: CardOptions) => { options: CardOptions } & any;

	$: {
		if (selectedTab.name === 'created' || selectedTab.name === 'collected') {
			cardPropsMapper = (v: CardOptions) => ({ options: v, menuItems: address === $currentUserAddress ? ['hide', 'copy'] : [] });
		} else if (selectedTab.name === 'hidden') {
			cardPropsMapper = (v: CardOptions) => ({ options: v, menuItems: address === $currentUserAddress ? ['reveal'] : [] });
		} else {
			cardPropsMapper = (v) => ({ options: v });
		}
	}
</script>

<div class="">
	<div class="pt-24  px-36">
		<div class="h-96 gradient-border !border-t-0 !border-x-0 !border-b-4 w-full">
			{#if $localProfileData?.coverUrl}
				<div style="background-image: url({$localProfileData?.coverUrl})" class="w-full h-full bg-center bg-no-repeat bg-cover" />
			{/if}
		</div>

		<div class="flex mt-8 text-white justify-between w-full flex-wrap gap-20">
			<div class="flex gap-4 ">
				<!-- Profile image -->
				<div class="grid w-28 h-28 overflow-hidden place-items-center">
					{#if $localProfileData?.thumbnailUrl}
						<img src={$localProfileData?.thumbnailUrl} class="h-full object-cover" alt="User avatar." />
					{:else}
						<GuestUserAvatar />
					{/if}
				</div>
				<div class="flex flex-col gap-5 w-2/3">
					<div class="flex gap-2 items-center">
						{#if $localProfileData?.username}
							<div class="font-semibold text-4xl whitespace-nowrap">
								{$localProfileData?.username}
							</div>
						{:else}
							<span class="whitespace-nowrap">No username</span>
						{/if}

						{#if $localProfileData?.status === 'AWAITING_VERIFIED' || $localProfileData?.status === 'VERIFIED' || $localProfileData?.roles?.includes('verified_user') || $localProfileData?.roles?.includes('inactivated_user')}
							<div class:grayscale={$localProfileData?.status === 'AWAITING_VERIFIED' || !storage.hasRole('minter', address)}>
								<VerifiedBadge class="w-6 h-6" />
							</div>
						{/if}
					</div>

					<!-- Buttons -->
					<div class="flex gap-4">
						{#if address === $currentUserAddress}
							<div class="w-32" transition:fade|local>
								<PrimaryButton on:click={() => goto('/profile/edit')}>{firstTimeUser ? 'Setup Profile' : 'Edit Profile'}</PrimaryButton>
							</div>
						{:else if $currentUserAddress}
							{#if isFollowing}
								<PrimaryButton
									extButtonClass="w-40"
									on:click={async () => {
										isFollowing = await followUnfollowUser(address, false);
									}}
								>
									<div class="text-lg">Unfollow</div>
								</PrimaryButton>
							{:else}
								<PrimaryButton
									extButtonClass="w-40"
									on:click={async () => {
										isFollowing = await followUnfollowUser(address, true);
									}}
								>
									<div class="text-lg">Follow</div>
								</PrimaryButton>
							{/if}
						{/if}
						<div class="relative">
							<div class="bg-transparent" on:click|stopPropagation={() => (shareButtonOpen = !shareButtonOpen)} bind:this={elemOpenBtn}>
								<PrimaryButton extButtonClass="w-20">
									<ShareV2 />
								</PrimaryButton>
							</div>
							{#if shareButtonOpen}
								<div
									bind:this={elemOpen}
									class="absolute text-white top-16 share-dropdown-outer z-30"
									transition:slide|local
									use:outsideClickCallback={{
										cb: (e) => {
											if (!e.composedPath().includes(elemOpen) && !e.composedPath().includes(elemOpenBtn)) {
												shareButtonOpen = false;
											}
										},
									}}
								>
									<div class="share-dropdown-mid">
										<div class="gradient-border !border-2 ">
											<div class="share-dropdown-inner p-5 flex gap-4">
												{#if $localProfileData.social.instagram}
													<div class="clickable" on:click={() => window.open($localProfileData.social.instagram)}>
														<Instagram class="w-10 h-10" />
													</div>
												{/if}
												{#if $localProfileData.social.discord}
													<div class="clickable" on:click={() => window.open($localProfileData.social.discord)}>
														<Discord class="w-10 h-10" />
													</div>
												{/if}

												{#if $localProfileData.social.twitter}
													<div class="clickable" on:click={() => window.open($localProfileData.social.twitter)}>
														<Twitter class="w-10 h-10" />
													</div>
												{/if}

												{#if $localProfileData.social.website}
													<div class="clickable" on:click={() => window.open($localProfileData.social.website)}>
														<Web class="w-10 h-10" />
													</div>
												{/if}
												{#if $localProfileData.social.pixiv}
													<div class="clickable" on:click={() => window.open($localProfileData.social.pixiv)}>
														<Pixiv class="w-10 h-10" />
													</div>
												{/if}
												{#if $localProfileData.social.deviantart}
													<div class="clickable" on:click={() => window.open($localProfileData.social.deviantart)}>
														<Deviantart class="w-10 h-10" />
													</div>
												{/if}
												{#if $localProfileData.social.artstation}
													<div class="clickable" on:click={() => window.open($localProfileData.social.artstation)}>
														<Artstation class="w-10 h-10" />
													</div>
												{/if}

												<div class="clickable" on:click={() => copyUrlToClipboard()}>
													<SocialCopy class="w-10 h-10" />
												</div>
											</div>
										</div>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Bio -->
			<div class="max-w-[600px] h-full">
				<div class="font-semibold text-4xl">BIO</div>
				<p class="mt-4 overflow-y-auto blue-scrollbar break-words max-w-sm max-h-24">
					{#if $localProfileData?.bio}
						{@html $localProfileData?.bio}
					{:else}
						<span class="text-sm">No bio.</span>
					{/if}
				</p>
			</div>

			<!-- Social links 
			<div class="overflow-hidden">
				<div class="font-bold whitespace-nowrap">SOCIAL LINKS</div>

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
			</div>-->

			<!-- Followers and address -->
			<div class="flex flex-col gap-4">
				<div class="flex justify-between items-center gap-10">
					<div class="">Followers</div>
					<div class="">{0}</div>
				</div>
				<div class="flex justify-between items-center gap-10">
					<div class="">Following</div>
					<div class="">{0}</div>
				</div>
				<div class="flex justify-between items-center gap-10">
					<div class="">Address</div>
					<EthAddress {address} concat etherScanLink={false} v2 />
				</div>
			</div>
		</div>
		<div class="container flex max-w-screen-xl mt-16 space-x-10 text-white">
			{#each tabs as tab}
				{#if displayedTabs.includes(tab.name)}
					<TabButton on:click={() => selectTab(tab.name)} selected={selectedTab.name === tab.name} uppercase>
						{tab.label}
					</TabButton>
				{/if}
			{/each}
		</div>

		<div class="h-px bg-white w-full" />
		<div class="">
			{#if $userHasRole('admin', 'superadmin') && selectedTab.data.some((i) => i.rawResourceData?.listingStatus === 'EXPIRED')}
				<div class="m-2 -mb-4 ">
					<InfoBox class="bg-dark-gradient">Expired listings of this user are displayed because you are viewing this profile as an admin.</InfoBox>
				</div>
			{/if}

			<NftList options={selectedTab.data} isLoading={isFetchingNfts} on:end-reached={handleReachedEnd} on:refresh-tabs={refreshNftTabs} reachedEnd={selectedTab.reachedEnd} {cardPropsMapper} />

			{#if $localProfileData && $userHasRole('admin', 'superadmin')}
				<AdminTools profileData={$localProfileData} on:requestDataUpdate={() => fetchData(address)} />
			{/if}
		</div>
	</div>
</div>

<style type="postcss">
	.share-dropdown-outer {
		background: linear-gradient(0deg, #67d4f8, #67d4f8);
	}

	.share-dropdown-mid {
		background: linear-gradient(
			56.67deg,
			rgba(167, 148, 255, 0) 11.15%,
			rgba(167, 148, 255, 0.93) 57.47%,
			rgba(142, 119, 247, 0) 127.41%,
			rgba(142, 119, 247, 0) 127.41%,
			rgba(167, 148, 255, 0) 127.41%
		);
	}

	.share-dropdown-inner {
		background: linear-gradient(180deg, #181f2a 0%, #131220 100%);
	}
</style>
