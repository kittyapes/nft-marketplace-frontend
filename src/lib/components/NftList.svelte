<script lang="ts">
	import { fetchTokenData } from '$utils/token/fetchToken';
	import NftCard from './NftCard.svelte';

	export let data: { token_uri: string }[];

	// We are waiting for at least 20 tokens to be fetched
	// to reduce jumping of the cards
	$: displayThreshold = Math.min(data?.length - 1, 20);
	$: displayCards = loadedTokens > displayThreshold;

	let loadedTokens = 0;

	function handleLoadedToken() {
		loadedTokens++;
		return '';
	}
</script>

{#if data === null || (data?.length && !displayCards)}
	<div class="placeholder">Loading...</div>
{/if}

{#if data?.length === 0}
	<div class="placeholder">Nothing to see here, move along.</div>
{/if}

{#if data?.length}
	<div class="nftGrid" class:hidden={!displayCards}>
		{#each data as data}
			{#await fetchTokenData(data.token_uri) then tokenData}
				{handleLoadedToken()}

				{#if displayCards}
					<NftCard data={null} {tokenData} />
				{/if}
			{/await}
		{/each}
	</div>
{/if}

<style>
	.placeholder {
		@apply p-36 font-semibold text-lg opacity-60;
	}

	.nftGrid {
		@apply grid min-w-full gap-3 p-2 my-5 mx-auto;
		grid-template-columns: repeat(auto-fit, minmax(215px, 1fr));
	}
</style>
