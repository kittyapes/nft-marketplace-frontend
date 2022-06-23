<script lang="ts">
	import NftCard from './NftCard.svelte';
	import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
	import DiamondsLoader from './DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';
	import { createEventDispatcher } from 'svelte';
	import { likedNfts, userLikedNfts } from '$stores/user';

	const dispatch = createEventDispatcher();

	export let options: NftCardOptions[];
	export let isLoading = false;
	export let reachedEnd = false;

	const inviewOptions = {};

	function onChange(event) {
		if (event.detail.inView) {
			dispatch('end-reached');
		}
	}

	async function markLiked() {
		options.forEach((nft) => {
			nft.favorite = $userLikedNfts?.filter((likedNft) => likedNft.nft._id === nft.id).length > 0;
			if ($likedNfts[0].length && $likedNfts[1] && $likedNfts[0].find((e) => nft.id === e)) {
				nft.likes += $likedNfts[1];
				$likedNfts = [[], 0];
			}
		});
		options = options;
	}

	$: {
		$userLikedNfts;
		options;
		markLiked();
	}
</script>

<div class="w-full">
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
		<div use:inview={inviewOptions} on:change={onChange} />{/if}

	{#if reachedEnd}
		<div class="text-center placeholder">You have reached the end of this list.</div>
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
