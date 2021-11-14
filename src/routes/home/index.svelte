<script lang="ts">
	import { fetchNfts } from '$lib/api/exploreMarket';
	import { fetchFeaturedArtists } from '$lib/api/featuredArtists';
	import { fetchTopCollections } from '$lib/api/topCollections';
	import Button from '$lib/components/Button.svelte';
	import CollectionCard from '$lib/components/CollectionCard.svelte';
	import FeaturedArtistCard from '$lib/components/FeaturedArtistCard.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import LatestDropSection from '$lib/sections/LatestDropSection.svelte';
	import StartStakingSection from '$lib/sections/StartStakingSection.svelte';
</script>

<div class="relative overflow-hidden max-w-[100vw]">
	<img src="/img/graphics/home-bg.png" alt="" class="bg-cover w-full" />

	<div class="absolute top-0 left-0 w-full h-full grid place-items-center">
		<div class="container px-8">
			<h1 class="uppercase text-white font-semibold text-7xl">Hinata<br />Marketplace</h1>

			<div class="text-white py-6 px-1 text-lg">
				Platform where you can create, buy and sell nfts
			</div>

			<div class="flex gap-x-4 mt-6">
				<Button>Explore Market</Button>
				<Button>Create</Button>
			</div>
		</div>
	</div>
</div>

<!-- Top collections -->
<div class="px-8 container mx-auto mt-28">
	<h2>Top Collections</h2>
	<div class="line" />

	<div class="flex flex-wrap gap-4">
		{#await fetchTopCollections()}
			Loading...
		{:then collections}
			{#each collections as collection}
				<CollectionCard title={collection.title} img={collection.img} />
			{/each}
		{/await}
	</div>
</div>

<!-- Featured artists -->
<div class="px-8 container mx-auto mt-28">
	<h2>Featured artists</h2>
	<div class="line" />

	<div class="flex flex-wrap gap-4">
		{#await fetchFeaturedArtists()}
			Loading...
		{:then artists}
			{#each artists as artist}
				<FeaturedArtistCard {...artist} />
			{/each}
		{/await}
	</div>
</div>

<!-- Explore market -->
<div class="px-8 container mx-auto mt-28">
	<h2>Explore market</h2>
	<div class="line" />

	<div class="flex flex-wrap gap-4">
		{#await fetchNfts()}
			Loading...
		{:then artists}
			{#each artists as artist}
				<NftCard {...artist} />
			{/each}
		{/await}
	</div>
</div>

<!-- Latest drop -->
<div class="px-8 container mx-auto mt-28">
	<h2>Latest drop</h2>
	<div class="line" />

	<LatestDropSection />
</div>

<!-- Start staking -->
<div class="px-8 container mx-auto mt-28">
	<h2>Start staking</h2>
	<div class="line" />

	<StartStakingSection />
</div>

<div class="mt-32" />

<style>
	h2 {
		@apply text-4xl font-normal uppercase;
	}

	div.line {
		@apply border-b border-black border-opacity-10 my-8;
	}
</style>
