<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PublicProfileData, UserData } from '$interfaces/userData';
	import FeaturedArtistCard from '$lib/components/FeaturedArtistCard.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import { listingToCardOptions } from '$utils/adapters/cardOptions';
	import type { Listing } from '$utils/api/listing';
	import { currentUserAddress } from "$stores/wallet";

	export let creator: UserData & { creatorListings: Listing[] };
	export let creatorFollowStatuses: { [address: string]: boolean } = {};
	export let listings: Listing[];
</script>

<div class="p-4 bg-dark-gradient grid grid-cols-4 gap-4 w-full cursor-pointer flex-wrap">
	<div class="col-span-2">
		<FeaturedArtistCard
			on:click={() => goto(`/profile/${creator.address}`)}
			creatorData={{
				name: creator.username,
				address: creator.address,
				coverImg: creator.coverUrl,
				profileImg: creator.thumbnailUrl,
				created: creator.totalMinted,
				isFollowing: ($currentUserAddress && creatorFollowStatuses[creator.address.toLowerCase()]) || false
			}}
		/>
	</div>

	{#each listings as listing}
		{#await listingToCardOptions(listing) then options}
			<NftCard {options} useLighterBackground />
		{/await}
	{/each}
</div>
