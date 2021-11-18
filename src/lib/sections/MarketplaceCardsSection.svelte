<script lang="ts">
	import Card from '$lib/components/marketplace/Card.svelte';

	import { request, gql } from 'graphql-request';

	const GET_CARDS = gql`
		query ($numberToSkip: Int!) {
			cards(first: 12, skip: $numberToSkip, orderBy: isAvailable, orderDirection: desc) {
				id
				amount
				totalSupply
				maxSupply
				uri
				creationDate
			}
		}
	`;

	const cards: any = request('https://api.thegraph.com/subgraphs/name/hysmagus/waifu', GET_CARDS, {
		numberToSkip: 0
	});
</script>

<div class="flex flex-wrap mt-11 justify-center gap-6 cards">
	{#await cards}
		Loading....
	{:then cardsData}
		{#each cardsData.cards as _card}
			<Card uri={_card.uri} maxSupply={_card.maxSupply} />
		{/each}
	{/await}
</div>
