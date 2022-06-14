<script lang="ts">
	import NftCard from './NftCard.svelte';
	import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
	import DiamondsLoader from './DiamondsLoader.svelte';
	import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
	import { currentUserAddress } from '$stores/wallet';

	export let options: NftCardOptions[];
	export let isLoading = false;

	let data: NftCardOptions[] = [];

	$: if (options && $currentUserAddress) markFavouriteNfts();

	let markFavouriteNfts = async () => {
		isLoading = true;
		if (!$currentUserAddress || !options.length) {
			isLoading = false;
			return;
		}

		const favorites = await getUserFavoriteNfts();
		options.forEach((t) => (t.favorite = favorites?.filter((f) => f.nftId === t.id).length > 0));
		data = options;

		isLoading = false;
	};
</script>

{#await markFavouriteNfts()}
	<DiamondsLoader />
{:then _}
	{#if !isLoading && data?.length === 0}
		<div class="placeholder">Nothing to see here, move along.</div>
	{:else if data?.length}
		<div class="nftGrid">
			{#each data as tokenData}
				<NftCard options={tokenData} />
			{/each}
		</div>
	{/if}
	{#if isLoading}
		<DiamondsLoader />
	{/if}
{/await}

<style type="postcss">
	.placeholder {
		@apply p-36 font-semibold text-lg opacity-60;
	}

	.nftGrid {
		@apply grid min-w-full gap-3 p-2 my-5 mx-auto;
		grid-template-columns: repeat(auto-fit, 215px);
	}
</style>
