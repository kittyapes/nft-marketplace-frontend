<script lang="ts">
	import Card from '$lib/components/marketplace/Card.svelte';
	import { onMount } from 'svelte';
	import { request, gql } from 'graphql-request';

	const GET_CARDS = gql`
		query ($numberToSkip: Int!) {
			cards(first: 15, skip: $numberToSkip, orderBy: isAvailable, orderDirection: desc) {
				id
				amount
				totalSupply
				maxSupply
				uri
				creationDate
			}
		}
	`;

	let allCards;
	let filteredCards: Array<object>;

	onMount(async () => {
		allCards = await request('https://api.thegraph.com/subgraphs/name/hysmagus/waifu', GET_CARDS, {
			numberToSkip: 0
		});
		filteredCards = allCards;
	});
</script>

<div class="flex flex-wrap mt-11 justify-center gap-6 cards">
	{#if filteredCards}
		{#each filteredCards.cards as _card}
			<Card uri={_card.uri} maxSupply={_card.maxSupply} />
		{/each}
	{:else}
		Loading...
	{/if}
</div>
