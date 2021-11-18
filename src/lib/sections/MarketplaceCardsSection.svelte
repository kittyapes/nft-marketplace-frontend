<script lang="ts">
	import Card from '$lib/components/marketplace/Card.svelte';

	import { request, gql } from 'graphql-request';

	const GET_CARDS = gql`
		query {
			cards(first: 12, skip: 0, orderBy: isAvailable, orderDirection: desc) {
				id
				amount
				totalSupply
				maxSupply
				uri
				creationDate
			}
		}
	`;

	const cards: any = request('https://api.thegraph.com/subgraphs/name/hysmagus/waifu', GET_CARDS);
</script>

<div class="flex flex-wrap mt-11 justify-center gap-6 cards">
	<!-- {#if $cards.loading}
		Loading..
	{:else if $cards.data}
		{#each $cards.data.cards as _card}
			<Card uri={_card.uri} maxSupply={_card.maxSupply} />
		{/each}
	{/if} -->
	<!-- {#await cards}
		Loading....
	{:then cardsData}
		{JSON.stringify(cardsData)}
	{/await} -->
	{#await cards}
		Loading....
	{:then cardsData}
		{#each cardsData.cards as _card}
			<Card uri={_card.uri} maxSupply={_card.maxSupply} />
		{/each}
	{/await}
</div>
