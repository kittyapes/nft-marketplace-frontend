<script lang="ts">
	import NftCard from './NftCard.svelte';
	import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
	import DiamondsLoader from './DiamondsLoader.svelte';
	import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
	import { currentUserAddress } from '$stores/wallet';
	import { inview } from 'svelte-inview';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let options: NftCardOptions[];
	export let isLoading = false;
	export let reachedEnd = false;

	// $: if (options && $currentUserAddress) markFavouriteNfts();

	// let markFavouriteNfts = async () => {
	// 	isLoading = true;
	// 	if (!$currentUserAddress || !options.length) {
	// 		isLoading = false;
	// 		return;
	// 	}

	// 	const favorites = await getUserFavoriteNfts();
	// 	options.forEach((t) => (t.favorite = favorites?.filter((f) => f.nftId === t.id).length > 0));
	// 	data = options;
	// 	// console.log(data);
	// 	isLoading = false;
	// };

	const inviewOptions = {};

	function onChange(event) {
		console.log(event);

		if (event.detail.inView && !reachedEnd) {
			dispatch('end-reached');
		}
	}
</script>

<div>
	<!-- {#await markFavouriteNfts()} -->
	<!-- <DiamondsLoader /> -->
	<!-- {:then _} -->
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
	<!-- {/await} -->
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
