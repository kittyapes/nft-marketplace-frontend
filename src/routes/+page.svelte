<script lang="ts">
	import { links } from '$constants/links';
	import { socials } from '$constants/socials';
	import CollectionsTable from '$lib/components/collections/CollectionsTable.svelte';
	import { apiGetMostActiveCollections, type Collection } from '$utils/api/collection';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { blogPosts } from '$stores/blog';
	import BlogPostPreview from '$lib/components/blog/BlogPostPreview.svelte';
	import { writable } from 'svelte/store';
	import { getRandomListings, type Listing } from '$utils/api/listing';
	import NftList from '$lib/components/NftList.svelte';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { listingToCardOptions } from '$utils/adapters/cardOptions';
	import HomepageCarousel from '$lib/components/v2/HomepageCarousel/HomepageCarousel.svelte';

	let collections: Collection[] = [];
	let exploreListings = writable<Listing[]>([]);
	let loadedExploreListings = writable(false);
	let exploreListingsData = [];

	const aidrop = {
		title: 'Claim your monthly airdrop',
		textPreview:
			'The Hinata marketplace will be doing an airdrop for active users in the coming months. Buyers, sellers and minters will all be eligible to claim tokens after the token generation event later this year.',
		thumbnail: '/img/png/airdrop-banner.png',
	};

	const getExploreMarketData = async () => {
		loadedExploreListings.set(false);
		exploreListings.set(await getRandomListings(10));
		exploreListingsData = (await Promise.all($exploreListings.map(listingToCardOptions))).filter((e) => e);
		loadedExploreListings.set(true);
	};

	// Please don't ask me why we need an auth token for this...
	// We don't anymore 🙂 🔪
	onMount(async () => {
		getExploreMarketData();
		collections = (await apiGetMostActiveCollections()).collections;
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
<div class="px-14 pt-32 w-full grid place-items-center ">
	<div class="w-1/2 h-[600px] ">
		<HomepageCarousel />
	</div>
</div>

<div class="text-white">
	<!-- Top collections section -->
	<div class="px-16 pt-24 mb-16">
		<div class="flex items-end">
			<h2 class="text-4xl font-light uppercase flex-grow">Most Active Collections</h2>
			<a href="/collections" class="uppercase underline text-sm font-bold">View all</a>
		</div>
		<hr class="mt-4 border-[#0000004D]" />
		{#if collections.length > 0}
			<CollectionsTable {collections} />
		{:else}
			<DiamondsLoader />
		{/if}
	</div>

	<!-- Explore Market Section -->
	{#if $loadedExploreListings && exploreListingsData?.length > 0}
		<div class="px-16 mt-24 mb-16" in:slide>
			<div class="flex items-end">
				<h2 class="text-4xl font-light uppercase flex-grow">Explore Market</h2>
				<a href="/marketplace" class="uppercase underline text-sm font-bold">View All</a>
			</div>
			<hr class="mt-4 border-[#0000004D]" />

			<NftList options={exploreListingsData} />
		</div>
	{/if}

	<!-- Latest blog posts -->
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
	</div>

	<!-- Monthly airdrop -->
	<div class="px-16 2xl:px-52 mt-24 mb-16">
		<div class="flex items-end">
			<h2 class="text-4xl leading-none font-semibold text-white uppercase flex-grow">Monthly Airdrop</h2>
		</div>
		<hr class="mt-4 border-[#FFFFFF1E]" />

		<div class="flex flex-col h-full py-11 overflow-hidden transition duration-100 cursor-pointer lg:flex-row hover:bg-[#FFFFFF1E]" in:fade>
			<div class="flex-shrink-0 h-full lg:h-[250px]">
				<img src={aidrop.thumbnail} alt="" class="object-cover h-full" style="aspect-ratio: 420/250;" />
			</div>
			<hr class="mt-4 border-[#0000004D]" />

			<div class="flex flex-col flex-grow text-white pt-8 lg:py-0 lg:ml-44">
				<div class="text-4xl font-light uppercase line-clamp-2 italic">
					{aidrop.title}
				</div>

				<p class="flex-grow mt-8">
					{aidrop.textPreview}
				</p>
			</div>
		</div>
	</div>
</div>
