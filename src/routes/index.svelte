<script lang="ts">
	import { links } from '$constants/links';
	import { socials } from '$constants/socials';
	import CollectionsTable from '$lib/components/collections/CollectionsTable.svelte';
	import { apiGetMostActiveCollections, type Collection } from '$utils/api/collection';
	import type { CollectionTableRow } from '$utils/api/collection';
	import { onMount } from 'svelte';
	import { blogPosts } from '$stores/blog';
	import BlogPostPreview from '$lib/components/blog/BlogPostPreview.svelte';
	import { writable } from 'svelte/store';
	import { getListings, type Listing } from '$utils/api/listing';
	import { adaptListingToNftCard } from '$utils/adapters/adaptListingToNftCard';
	import NftList from '$lib/components/NftList.svelte';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';

	let collections: Collection[] = [];
	let exploreListings = writable<Listing[]>([]);
	let exploreListingsData;

	const getExploreMarketData = async () => {
		exploreListings.set(await getListings(null, 1, 10));
		exploreListingsData = await Promise.all($exploreListings.map(adaptListingToNftCard));
	};

	// Please don't ask me why we need an auth token for this...
	// We don't anymore 🙂 🔪
	onMount(async () => {
		getExploreMarketData();
		collections = await apiGetMostActiveCollections();
		console.log(collections);
	});
</script>

<div
	class="
		relative
		max-w-[100vw]
		overflow-hidden bg-cover bg-no-repeat bg-[#194665]
		bg-[url('/img/graphics/home-bg.640.png')] h-[500px] bg-[center_top_-400px]
		sm:bg-[url('/img/graphics/home-bg.768.png')] sm:bg-[length:1280px] sm:h-[760px]
		md:bg-[url('/img/graphics/home-bg.1024.png')]
		lg:bg-[url('/img/graphics/home-bg.1280.png')] lg:bg-[length:1280px] lg:bg-[center_top_-150px]
		xl:bg-[url('/img/graphics/home-bg.1920.png')] xl:bg-[length:1536px] xl:bg-[center_top_-400px]
		2xl:bg-[url('/img/graphics/home-bg.4k.png')] 2xl:bg-cover 2xl:bg-[center_calc(50%+600px)]
		2k:h-[1300px]
		4k:h-[1500px] 4k:bg-[length:calc(max(100vw,4000px))] 4k:bg-[center_calc(50%+1000px)]
	"
>
	<div class="absolute top-1/4 -translate-y-1/4 left-0 w-full grid place-items-center">
		<div class="px-8">
			<h1 class="uppercase text-white font-bold text-7xl">
				Hinata
				<br />
				Marketplace
			</h1>

			<div class="text-white py-6 px-1 text-lg w-1/2 font-semibold">
				The Hinata platform features curated collections and artists of anime, manga, and all variety of illustrated work, including Art Blocks, Bored Ape Yacht Club, and more
			</div>

			<div class="flex gap-x-4 mt-6 h-16 uppercase font-semibold">
				<a class="flex flex-col justify-center items-center bg-white w-48 transition-btn" href={socials.twitter} target="_blank">Follow Us</a>

				<a class="flex flex-col justify-center items-center bg-white w-48 transition-btn" href={links.snapshot} target="_blank">Our Dao</a>
			</div>
		</div>
	</div>
</div>

<!-- Top collections section -->
<div class="px-16 mt-24 mb-16">
	<div class="flex items-end">
		<h2 class="text-4xl font-light uppercase flex-grow">Most Active Collections</h2>
		<a href="/collections" class="uppercase underline text-sm font-bold">View all</a>
	</div>
	<hr class="mt-4 border-[#0000004D]" />
	<CollectionsTable {collections} />
</div>

<!-- Explore Market Section -->
<div class="px-16 mt-24 mb-16">
	<div class="flex items-end">
		<h2 class="text-4xl font-light uppercase flex-grow">Explore Market</h2>
		<a href="/marketplace" class="uppercase underline text-sm font-bold">View All</a>
	</div>
	<hr class="mt-4 border-[#0000004D]" />

	{#if exploreListingsData?.length}
		<NftList options={exploreListingsData} />
	{:else}
		<DiamondsLoader />
	{/if}
</div>

<!-- Latest blog posts -->
<div class="px-16 mt-24 mb-16">
	<div class="flex items-end">
		<h2 class="text-4xl font-light uppercase flex-grow">Latest Blog Posts</h2>
		<a href="https://hinatafoundation.medium.com/" target="_blank" class="uppercase underline text-sm font-bold">View Latest Posts</a>
	</div>
	<hr class="mt-4 border-[#0000004D]" />

	{#if $blogPosts.length}
		{#each $blogPosts.slice(0, 2) as post}
			<BlogPostPreview data={post} />
		{/each}
	{/if}
</div>
