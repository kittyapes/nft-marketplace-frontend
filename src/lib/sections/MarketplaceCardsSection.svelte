<script lang="ts">
	import Card from '$lib/components/marketplace/Card.svelte';
	import axios from 'axios';
	import { ethers } from 'ethers';
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

	let oldCards;
	let allCards = [];

	onMount(async () => {
		oldCards = await request('https://api.thegraph.com/subgraphs/name/hysmagus/waifu', GET_CARDS, {
			numberToSkip: 0
		});

		getCardMetadata(oldCards).then((data) => {
			allCards = data;
			console.log(allCards);
		});
	});

	const getCardMetadata: any = async (_cards) => {
		return Promise.all(
			_cards.cards.map(async (card) => {
				let uri = card.uri.replace('radiant-falls-54169', 'databasewaifu');
				let amount = ethers.utils.formatEther(card.amount);

				const response: any = await axios.get(uri).catch((error) => console.log(error.message));

				if (response['headers']['content-length'] == '0') return;

				let {
					name,
					id,
					generation,
					image,
					animation_url,
					categories,
					categoryIndex,
					batch,
					artist
				} = response.data;

				return {
					...card,
					amount,
					uri,
					id,
					name,
					image,
					animation_url,
					generation,
					categories,
					categoryIndex,
					batch,
					artist
				};
			})
		).then((data) => {
			return data;
		});
	};
</script>

<div class="flex flex-wrap mt-11 justify-center gap-6 cards">
	{#if allCards}
		{#each allCards as _card}
			<Card metadata={_card} />
		{/each}
	{:else}
		Loading...
	{/if}
</div>
