<script lang="ts">
	import Card from '$lib/components/marketplace/Card.svelte';
	import { onMount } from 'svelte';
	import { request, gql } from 'graphql-request';
	import { fetchAllMetadata } from '$utils/api/getNFT';

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
	let allCards;

	onMount(async () => {
		oldCards = await request('https://api.thegraph.com/subgraphs/name/hysmagus/waifu', GET_CARDS, {
			numberToSkip: 0
		});

		fetchAllMetadata(oldCards).then((data) => {
			allCards = data;
		});
	});
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
