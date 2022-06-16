<script lang="ts">
	import NftCard from './NftCard.svelte';
	import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
	import DiamondsLoader from './DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';
	import { createEventDispatcher } from 'svelte';
	import { userLikedNfts } from '$stores/user';

	const dispatch = createEventDispatcher();

	export let options: NftCardOptions[];
	export let isLoading = false;
	export let reachedEnd = false;

	const inviewOptions = {};

	function onChange(event) {
		if (event.detail.inView && !reachedEnd) {
			dispatch('end-reached');
		}
	}

	function markLiked() {
		options.forEach((nft) => {
			nft.favorite = $userLikedNfts.filter((likedNft) => likedNft.nft.nftId === nft.id).length > 0;
		});
	}

	$: {
		$userLikedNfts;
		options;
		markLiked();
	}
</script>

<div>
	{#if !isLoading && options?.length === 0}
		<div class="placeholder">Nothing to see here, move along.</div>
	{/if}

	{#if options?.length}
		<div class="nftGrid">
			{#each options as tokenData}
				<NftCard options={tokenData} />
			{/each}
		</div>
	{/if}

	{#if isLoading}
		<DiamondsLoader />
	{:else}
		<div use:inview={inviewOptions} on:change={onChange} />
	{/if}

	{#if reachedEnd}
		<div class="placeholder text-center">You have reached the end of this list.</div>
	{/if}
</div>

<style type="postcss">
	.placeholder {
		@apply p-36 font-semibold text-lg opacity-60;
	}

	.nftGrid {
		@apply grid min-w-full gap-3 p-2 my-5 mx-auto;
		grid-template-columns: repeat(auto-fit, 215px);
	}
</style>
