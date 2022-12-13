<script lang="ts">
	import { apiGetMostActiveCollections, type Collection } from '$utils/api/collection';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { blogPosts } from '$stores/blog';
	import BlogPostPreview from '$lib/components/blog/BlogPostPreview.svelte';
	import { get, writable } from 'svelte/store';
	import { getRandomListings, type Listing } from '$utils/api/listing';
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

	let exploreListings = writable<Listing[]>([]);
	let loadedExploreListings = writable(false);
	let exploreListingsData = [];

	let hottestCreators = writable<{ users: PublicProfileData[]; totalCount: number }>(null);
	let loadedHottestCreators = writable(false);
	const hottestCreatorsCount = 3;

	const getExploreMarketData = async () => {
		loadedExploreListings.set(false);
		exploreListings.set(await getRandomListings(10));
		exploreListingsData = (await Promise.all($exploreListings.map(listingToCardOptions))).filter((e) => e);
		loadedExploreListings.set(true);
	};

	const getHottestCreatorsData = async () => {
		loadedHottestCreators.set(false);
		hottestCreators.set(await searchUsersByName('ste', hottestCreatorsCount));
		loadedHottestCreators.set(true);
	};

	onMount(async () => {
		await getExploreMarketData();
		await getHottestCreatorsData();
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
<div class="px-[32px] 2xl:px-[172px] pt-32 w-full grid place-items-center text-white">
	<!-- Hero section -->
	<div class="mb-16 flex gap-5 items-stretch w-full">
		{#if $loadedExploreListings}
			<div class="w-[277px] 2xl:w-[345px]">
				<NftCard options={exploreListingsData[0]} />
			</div>
		{/if}
		<div class="min-h-[500px] flex-grow">
			<HomepageCarousel />
		</div>
		{#if $loadedExploreListings}
			<div class="w-[277px] 2xl:w-[345px]">
				<NftCard options={exploreListingsData[0]} />
			</div>
		{/if}
	</div>

	<!-- Top collections section -->
	<div class="w-full">
		<TopCollections />
	</div>

	<!-- Hottest creators section -->
	<!-- {#if $loadedHottestCreators}
		<div class="pt-20 w-full h-full" in:slide>
			<h2 class="text-2xl leading-7">Hottest creators</h2>
			<div class="flex flex-col gap-4 mt-10 justify-center h-full">
				{#each get(hottestCreators).users as creator}
					<div class="p-4 bg-card-gradient flex gap-4 w-full ">
						<FeaturedArtistCard
							creatorData={{
								name: creator.username,
								address: creator.address,
								coverImg: creator.coverUrl,
								profileImg: creator.thumbnailUrl,
								created: 0,
							}}
						/>
						{#if $loadedExploreListings}
							<NftCard options={exploreListingsData[0]} />
							<NftCard options={exploreListingsData[exploreListingsData.length - 1]} />
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if} -->

	<!-- Tending nfts Section -->
	{#if $loadedExploreListings && exploreListingsData?.length > 0}
		<div class="my-24 w-full" in:slide>
			<h2 class="text-2xl leading-7">Trending NFTs</h2>

			<div class="mb-20">
				<NftList options={exploreListingsData} />
			</div>

			<a href="/marketplace" class="w-full"><PrimaryButton class="w-full">Explore Marketplace</PrimaryButton></a>
		</div>
	{/if}

	<!-- Latest blog posts 
	<div class="px-16 2xl:px-52 mt-24 mb-16">
		<div class="flex items-end">
			<h2 class="text-4xl leading-none font-semibold text-white uppercase flex-grow">BLOG</h2>
			<a href="/blog" class="uppercase text-white underline text-sm font-bold">View Latest Posts</a>
		</div>
		<hr class="mt-4 border-[#FFFFFF1E]" />

		{#if $blogPosts.length}
			{#each $blogPosts.slice(0, 2) as post}
				<BlogPostPreview data={post} />
			{/each}
		{/if}
	</div>-->

	<MonthlyAirdropWidget />
</div>
