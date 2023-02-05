<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PublicProfileData } from '$interfaces/userData';
	import FeaturedArtistCard from '$lib/components/FeaturedArtistCard.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import { listingToCardOptions } from '$utils/adapters/cardOptions';
	import type { Listing } from '$utils/api/listing';

	export let creator: PublicProfileData;
	export let listings: Listing[];
</script>

<div class="p-4 bg-card-gradient grid grid-cols-4 gap-4 w-full cursor-pointer flex-wrap">
	<div class="col-span-2">
		<FeaturedArtistCard
			on:click={() => goto(`/profile/${creator.address}`)}
			creatorData={{
				name: creator.username,
				address: creator.address,
				coverImg: creator.coverUrl,
				profileImg: creator.thumbnailUrl,
				created: null,
			}}
		/>
	</div>

	{#each listings as listing}
		{#await listingToCardOptions(listing) then options}
			<NftCard {options} />
		{/await}
	{/each}
</div>
