<script lang="ts">
	import Card from '$lib/components/marketplace/Card.svelte';
	import { onMount } from 'svelte';
	import { request } from 'graphql-request';
	import { GET_ALL_CARDS } from '../../../graphql/marketplace';
	import { fetchAllMetadata } from '$utils/api/getNFT';

	let oldCards;
	let allCards;

	onMount(async () => {
		oldCards = await request(
			'https://api.thegraph.com/subgraphs/name/hysmagus/waifu',
			GET_ALL_CARDS,
			{
				numberToSkip: 0
			}
		);

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
