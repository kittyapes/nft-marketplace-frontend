<script lang="ts">
	import Card from '$lib/components/marketplace/Card.svelte';
	import { query } from 'svelte-apollo';
	import { gql } from '@apollo/client/core';

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

	const cards: any = query(GET_CARDS, {
		variables: { numberToSkip: 0 }
	});
</script>

<div class="flex flex-wrap mt-11 justify-center gap-6 cards">
	{#if $cards.loading}
		Loading..
	{:else if $cards.data}
		{#each $cards.data.cards as _card}
			<Card uri={_card.uri} maxSupply={_card.maxSupply} />
		{/each}
	{/if}
</div>
