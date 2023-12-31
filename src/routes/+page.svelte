<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import { onDestroy, onMount } from 'svelte';
	import { blogPosts } from '$stores/blog';
	import BlogPostPreview from '$lib/components/blog/BlogPostPreview.svelte';
	import { writable } from 'svelte/store';
	import {
		getListingCreators,
		getTrendingListings,
		type Listing,
		type ListingCreatorsData,
	} from '$utils/api/listing';
	import NftList from '$lib/components/NftList.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { listingToCardOptions } from '$utils/adapters/cardOptions';
	import HomepageCarousel from '$lib/components/v2/HomepageCarousel/HomepageCarousel.svelte';
	import TopCollections from '$components/v2/TopCollections/+page.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import NotificationBar from '$lib/components/NotificationBar.svelte';
	import {
		getNotifications,
		updateNotificationAsUser,
		type UserNotification,
	} from '$utils/api/notifications';
	import dayjs from 'dayjs';
	import { WalletState, walletState } from '$utils/wallet';
	import { currentUserAddress } from '$stores/wallet';
	import CreatorWithNfts from '$lib/components/v2/CreatorWithNfts/CreatorWithNfts.svelte';
	import { goto } from '$app/navigation';
	import { fetchIsFollowing } from "$utils/api/following";

	$: isWalletDataLoaded =
		$walletState === WalletState.DISCONNECTED ||
		($currentUserAddress && $walletState === WalletState.CONNECTED);

	let trendingListings = writable<Listing[]>([]);
	let loadedTrendingListings = writable(false);
	let trendingListingsData = [];

	let userNotification = writable<UserNotification>(null);
	let loadedUserNotification = writable(false);
	let userNotificationCleared = writable(false);
	// in miliseconds
	const notificationFetchingTime = 30_000;

	const getTrendingListingsData = async () => {
		loadedTrendingListings.set(false);
		trendingListings.set(await getTrendingListings(12));
		trendingListingsData = (await Promise.all($trendingListings.map(listingToCardOptions))).filter(
			(e) => e,
		);
		loadedTrendingListings.set(true);
	};

	let hottestCreators: ListingCreatorsData;

	const getHottestCreatorsData = async () => {
		const listingCreatorsRes = await getListingCreators({ limit: 3 });

		if (listingCreatorsRes.err) {
			// notifyError('Failed to load hottest creators.');
			return;
		}

		hottestCreators = listingCreatorsRes.data.data;
	};

	let creatorFollowStatuses = writable<{ [address: string]: boolean }>({});

	async function checkFollowStatus(creatorAddresses) {
		creatorAddresses.length && creatorFollowStatuses.set(await fetchIsFollowing(creatorAddresses));
	}

	const getUserNotification = async () => {
		if (!$userNotification) loadedUserNotification.set(false);

		const res = (await getNotifications(!!$currentUserAddress))?.data?.data;
		if (!res) return;

		const notification = res.find(
			(n) =>
				!n.hasCleared &&
				n.location === 'GLOBAL' &&
				dayjs().isAfter(dayjs(n.publishAt)) &&
				(!n.expireAt || dayjs().isBefore(dayjs(n.expireAt))),
		);
		userNotificationCleared.set(false);

		if (!notification) {
			userNotification.set(null);
			loadedUserNotification.set(true);
			return;
		}

		userNotification.set(notification);

		loadedUserNotification.set(true);

		if (!notification.readAt && $currentUserAddress)
			await updateNotificationAsUser({
				id: $userNotification._id,
				readAt: dayjs().format(),
				hasCleared: false,
			});
	};

	const clearNotification = async () => {
		await updateNotificationAsUser({ id: $userNotification._id, hasCleared: true });
		userNotificationCleared.set(true);
	};

	let notificationFetchingInterval = setInterval(() => {
		getUserNotification();
	}, notificationFetchingTime);

	onDestroy(() => clearInterval(notificationFetchingInterval));

	onMount(async () => {
		getHottestCreatorsData();
		getTrendingListingsData();
	});

	$: if (isWalletDataLoaded) getUserNotification();
	$: hottestCreators?.users.length > 0 && checkFollowStatus(hottestCreators?.users?.map(creator => creator.address));
</script>

<MetaTags
	title="Hinata - Anime NFT Marketplace"
	description="The anime and metaverse NFT platform for browsing and creating web3 artwork that you can auction, raffle or sell for cryptocurrency using your Ethereum wallet."
	canonical="https://hinata.io/"
	openGraph={{
		type: 'website',
		url: 'https://hinata.io/',
		title: 'Hinata - Anime NFT Marketplace',
		description:
			'The anime and metaverse NFT platform for browsing and creating web3 artwork that you can auction, raffle or sell for cryptocurrency using your Ethereum wallet.',
		images: [
			{
				url: 'https://hinata-prod.mypinata.cloud/ipfs/QmSL6bqojDfspYKai2jmFY19ZHng8X3XmHZZEAmmGum6TE',
				width: 1200,
				height: 750,
				alt: 'Hinata anime characters on a festival.',
			},
		],
		site_name: 'Hinata',
	}}
/>

<!-- Notifications -->
{#if $loadedUserNotification && $userNotification && !$userNotificationCleared}
	<div class="w-full text-white mt-20" in:fly={{ x: -2000, duration: 1000 }}>
		<NotificationBar
			notification={$userNotification}
			wrapperClass={'h-16'}
			on:click={() => clearNotification()}
		/>
	</div>
{/if}

<div
	class="px-36 pt-32 w-full text-white"
	class:pt-0={$loadedUserNotification && $userNotification && !$userNotificationCleared}
>
	<div class="overflow-hidden">
		<!-- Hero section -->
		<!-- TODO fix this properly -->
		{#if $loadedTrendingListings && trendingListingsData.length >= 2}
			<div class="mb-16 grid grid-cols-4 gap-5 items-stretch w-full">
				<NftCard options={trendingListingsData[0]} />

				<div class="flex-grow col-span-2">
					<HomepageCarousel />
				</div>

				<NftCard options={trendingListingsData[1] || trendingListingsData[0]} />
			</div>
		{/if}

		<!-- Top collections section -->
		<div class="w-full">
			<TopCollections />
		</div>

		<!-- Hottest creators section -->
		{#if hottestCreators?.users.length}
			<div class="pt-20 w-full" in:slide>
				<div class="w-full flex justify-between">
					<h2 class="text-2xl leading-7">Hottest Creators</h2>
					<button
						class="gradient-underline text-lg clickable"
						on:click={() => goto('/marketplace/creators')}
					>
						View all
					</button>
				</div>

				<div class="flex flex-col gap-4 mt-10 justify-center h-full">
					{#each hottestCreators?.users || [] as user}
						<CreatorWithNfts creator={user} listings={user.creatorListings.slice(0, 2)} creatorFollowStatuses={$creatorFollowStatuses} />
					{/each}
				</div>
			</div>
		{/if}

		<!-- Latest blog posts -->
		<div class="mt-12 mb-16">
			<div class="flex items-end mb-12">
				<h2 class="text-2xl leading-none text-white flex-grow">Latest Blog Posts</h2>
				<a href="/blog" class=" text-white gradient-underline text-lg relative">
					View latest posts
				</a>
			</div>

			{#if $blogPosts.length}
				<div class="flex flex-col gap-10">
					{#each $blogPosts.slice(0, 2) as post}
						<BlogPostPreview data={post} />
					{/each}
				</div>
			{/if}
		</div>

		<!-- <MonthlyAirdropWidget /> -->

		<!-- Tending nfts Section -->
		{#if $loadedTrendingListings && trendingListingsData?.length > 0}
			<div class="my-24 w-full" in:slide>
				<h2 class="text-2xl leading-7">Explore Market</h2>

				<div class="mb-20 mt-12">
					<NftList options={trendingListingsData} />
				</div>

				<a href="/marketplace/listings" class="w-full">
					<PrimaryButton extButtonClass="w-full">Explore Marketplace</PrimaryButton>
				</a>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.gradient-underline::after {
		content: '';
		@apply absolute w-full -bottom-1 left-0 h-[2px];
		@apply bg-gradient-to-r from-color-purple to-color-blue;
	}
</style>
