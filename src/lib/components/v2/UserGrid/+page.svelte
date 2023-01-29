<script lang="ts">
	import { goto } from '$app/navigation';
	import FeaturedArtistCard from '$lib/components/FeaturedArtistCard.svelte';

	export let users = [];
	export let isLoading = false;
</script>

<div class="w-full grid gap-x-0 gap-y-4 2xl:gap-y-5 text-white users">
	{#if users?.length > 0}
		{#each users as user}
			<FeaturedArtistCard
				on:click={() => goto(`/profile/${user.address}`)}
				creatorData={{
					name: user.username,
					address: user.address,
					coverImg: user.coverUrl,
					profileImg: user.thumbnailUrl,
					created: 0,
				}}
			/>
		{/each}
	{:else if users?.length === 0 && !isLoading}
		<p class="p-36 whitespace-nowrap font-semibold text-lg opacity-70">Nothing to see here, move along.</p>
	{/if}
</div>
