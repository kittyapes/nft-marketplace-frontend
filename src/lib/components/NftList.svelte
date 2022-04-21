<script lang="ts">
	import NftCard from './NftCard.svelte';
	import { fetchTokenUriData } from '$utils/nfts/fetchTokenUriData';
	import type { TokenData } from 'src/interfaces/tokenData';
	import { adaptNftCard } from '$utils/adapters/adaptNftCard';
	import NftDisplayPopup from './profile/NFTDisplayPopup.svelte';
	import { setPopup } from '$utils/popup';

	export let data: TokenData[];

	function handleOpenPopup(data: TokenData) {
		setPopup(NftDisplayPopup, { props: { data } });
	}
</script>

{#if data === null}
	<div class="placeholder">Loading...</div>
{/if}

{#if data?.length === 0}
	<div class="placeholder">Nothing to see here, move along.</div>
{/if}

{#if data?.length}
	<div class="nftGrid">
		{#each data.map(adaptNftCard) as tokenData, i}
			{#if tokenData.name}
				<!-- Fetching images and animations from tokenUri, because the default
				fetched image are sometimes invalid -->

				{#await fetchTokenUriData(tokenData.tokenUri)}
					<NftCard on:click={() => handleOpenPopup(data[i])} {...tokenData} />
				{:then tokenUriData}
					<NftCard on:click={() => handleOpenPopup(data[i])} {...tokenData} imageUrl={tokenUriData?.image || tokenData.imageUrl} />
				{:catch}
					<NftCard on:click={() => handleOpenPopup(data[i])} {...tokenData} />
				{/await}
			{/if}
		{/each}
	</div>
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
