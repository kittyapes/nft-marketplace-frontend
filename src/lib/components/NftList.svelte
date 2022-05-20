<script lang="ts">
	import NftCard from './NftCard.svelte';
	import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
	import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
	import DiamondsLoader from './DiamondsLoader.svelte';

	export let data: NftCardOptions[];
	export let isLoading = false;

	let updateData = async () => {
		const favorites = await getUserFavoriteNfts();
		data.forEach((t) => favorites?.includes(t.id));
	};
</script>

{#await updateData()}
	<div class="placeholder">Loading...</div>
{:then _}
	{#if !(isLoading || data === null) && data?.length === 0}
		<div class="placeholder">Nothing to see here, move along.</div>
	{/if}

	{#if data?.length === 0}
		<div class="placeholder">Nothing to see here, move along.</div>
	{/if}

	{#if data?.length}
		<div class="nftGrid">
			{#each data as tokenData}
				{#if tokenData.title}
					<NftCard options={tokenData} />
				{/if}
			{/each}
		</div>
	{/if}
{/await}

{#if isLoading || data === null}
	<DiamondsLoader />
{/if}

<style type="postcss">
	.placeholder {
		@apply p-36 font-semibold text-lg opacity-60;
	}

	.nftGrid {
		@apply grid min-w-full gap-3 p-2 my-5 mx-auto;
		grid-template-columns: repeat(auto-fit, minmax(215px, 1fr));
	}
</style>
