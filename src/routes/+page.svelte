<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onDestroy, onMount } from 'svelte';
	import { blogPosts } from '$stores/blog';
	import BlogPostPreview from '$lib/components/blog/BlogPostPreview.svelte';
	import { get, writable } from 'svelte/store';
	import { getTrendingListings, type Listing } from '$utils/api/listing';
	import NftList from '$lib/components/NftList.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { listingToCardOptions } from '$utils/adapters/cardOptions';
	import HomepageCarousel from '$lib/components/v2/HomepageCarousel/HomepageCarousel.svelte';
	import TopCollections from '$components/v2/TopCollections/+page.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import type { PublicProfileData } from '$interfaces/userData';
	import { searchUsersByName } from '$utils/api/search/globalSearch';
	import FeaturedArtistCard from '$lib/components/FeaturedArtistCard.svelte';
	import MonthlyAirdropWidget from '$lib/components/v2/MonthlyAirdropWidget.svelte';
	import { goto } from '$app/navigation';
	import NotificationBar from '$lib/components/NotificationBar.svelte';
	import { getNotifications, updateNotificationAsUser, type UserNotification } from '$utils/api/notifications';
	import dayjs from 'dayjs';

	let trendingListings = writable<Listing[]>([]);
	let loadedTrendingListings = writable(false);
	let trendingListingsData = [];

	let hottestCreators = writable<{ users: PublicProfileData[]; totalCount: number }>(null);
	let loadedHottestCreators = writable(false);
	const hottestCreatorsCount = 3;

	let userNotification = writable<UserNotification>(null);
	let loadedUserNotification = writable(false);
	let userNotificationCleared = writable(false);
	// in miliseconds
	const notificationFetchingTime = 30_000;

	const getTrendingListingsData = async () => {
		loadedTrendingListings.set(false);
		trendingListings.set(await getTrendingListings(12));
		trendingListingsData = (await Promise.all($trendingListings.map(listingToCardOptions))).filter((e) => e);
		loadedTrendingListings.set(true);
	};

	const getHottestCreatorsData = async () => {
		loadedHottestCreators.set(false);
		hottestCreators.set(await searchUsersByName('ste', hottestCreatorsCount));
		loadedHottestCreators.set(true);
	};

	const getUserNotification = async () => {
		if (!$userNotification) loadedUserNotification.set(false);
		const res = (await getNotifications()).data.data;

		const notification = res.find((n) => !n.hasCleared && dayjs().isAfter(dayjs(n.publishAt)) && (!n.expireAt || dayjs().isBefore(dayjs(n.expireAt))));

		if (!notification) {
			userNotification.set(null);
			loadedUserNotification.set(true);
			return;
		}

		userNotification.set(notification);

		loadedUserNotification.set(true);

		if (!notification.readAt) await updateNotificationAsUser({ id: $userNotification._id, readAt: dayjs().format(), hasCleared: false });
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
		getUserNotification();
		getHottestCreatorsData();
		getTrendingListingsData();
	});
</script>

<MetaTags
	title="Hinata - Anime NFT Marketplace"
	description="The anime and metaverse NFT platform for browsing and creating web3 artwork that you can auction, raffle or sell for cryptocurrency using your Ethereum wallet."
	canonical="https://hinata.io/"
	openGraph={{
		type: 'website',
		url: 'https://hinata.io/',
		title: 'Hinata - Anime NFT Marketplace',
		description: 'The anime and metaverse NFT platform for browsing and creating web3 artwork that you can auction, raffle or sell for cryptocurrency using your Ethereum wallet.',
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
	<div class="w-full text-white mt-20" transition:slide|local>
		<NotificationBar notification={$userNotification} wrapperClass={'h-16'} on:click={() => clearNotification()} />
	</div>
{/if}

<div class="px-36 pt-32 w-full grid place-items-center text-white">
	<!-- Hero section -->
	<!-- TODO fix this properly -->
	{#if $loadedTrendingListings && trendingListingsData.length >= 2}
		<div class="mb-16 flex gap-5 items-stretch w-full max-h-[550px]" in:slide|local={{ duration: 1000 }}>
			<NftCard options={trendingListingsData[0]} />

			<div class="flex-grow">
				<HomepageCarousel />
			</div>

			<NftCard options={trendingListingsData[trendingListingsData.length - 1]} />
		</div>
	{/if}

	<!-- Top collections section -->
	<div class="w-full">
		<TopCollections />
	</div>

	<!-- Hottest creators section -->
	<!-- TODO fix this properly -->
	{#if $loadedHottestCreators && $loadedTrendingListings && trendingListingsData.length >= 2}
		<div class="pt-20 w-full h-full" in:slide>
			<h2 class="text-2xl leading-7">Hottest creators</h2>
			<div class="flex flex-col gap-4 mt-10 justify-center h-full">
				{#each get(hottestCreators).users as creator}
					<div class="p-4 bg-card-gradient flex gap-4 w-full cursor-pointer">
						<div class="w-1/2">
							<FeaturedArtistCard
								on:click={() => goto(`/profile/${creator.address}`)}
								creatorData={{
									name: creator.username,
									address: creator.address,
									coverImg: creator.coverUrl,
									profileImg: creator.thumbnailUrl,
									created: 0,
								}}
							/>
						</div>
						<NftCard options={trendingListingsData[0]} />
						<NftCard options={trendingListingsData[trendingListingsData.length - 1]} />
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Latest blog posts -->
	<div class=" mt-60 mb-16">
		<div class="flex items-end mb-12">
			<h2 class="text-4xl leading-none text-white flex-grow">Latest blog post</h2>
			<a href="/blog" class=" text-white gradient-underline text-lg relative">View latests posts</a>
		</div>

		{#if $blogPosts.length}
			<div class="flex flex-col gap-10">
				{#each $blogPosts.slice(0, 2) as post}
					<BlogPostPreview data={post} />
				{/each}
			</div>
		{/if}
	</div>

	<MonthlyAirdropWidget />

	<!-- Tending nfts Section -->
	{#if $loadedTrendingListings && trendingListingsData?.length > 0}
		<div class="my-24 w-full" in:slide>
			<h2 class="text-4xl leading-7">Explore Market</h2>

			<div class="mb-20">
				<NftList options={trendingListingsData} />
			</div>

			<a href="/marketplace/listings" class="w-full"><PrimaryButton extButtonClass="w-full">Explore Marketplace</PrimaryButton></a>
		</div>
	{/if}
</div>

<style type="postcss">
	.gradient-underline::after {
		content: '';
		@apply absolute w-full -bottom-1 left-0 h-[2px];
		@apply bg-gradient-to-r from-color-purple to-color-blue;
	}
</style>
