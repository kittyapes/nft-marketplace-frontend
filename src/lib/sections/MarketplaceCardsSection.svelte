<script lang="ts">
	import Card from '$lib/components/marketplace/Card.svelte';
	import { onMount } from 'svelte';
	import { request } from 'graphql-request';
	import { fetchAllMetadata } from '$utils/api/getNFT';
	import { priceFilters, statusFilters } from '$stores/marketplace';
	import { GET_ALL_CARDS } from '$utils/graphql/marketplace';

	let oldCards;
	let allCards;
	let filteredCards;

	onMount(async () => {
		oldCards = await request('https://api.thegraph.com/subgraphs/name/hysmagus/waifu', GET_ALL_CARDS, {
			numberToSkip: 0
		});

		fetchAllMetadata(oldCards).then((data) => {
			allCards = data;
			filteredCards = data;
		});
	});

	$: {
		filteredCards = allCards;

		// Status filter
		if (allCards && $statusFilters.size > 0) {
			filteredCards = filteredCards.filter((_card) => {
				return $statusFilters.has(_card?.status);
			});
		}

		// Price filter
		if (allCards && $priceFilters.min < $priceFilters.max && $priceFilters.min != 0 && $priceFilters.max != 0) {
			filteredCards = filteredCards.filter((_card) => {
				return parseFloat(_card?.amount) >= $priceFilters.min && parseFloat(_card?.amount) <= $priceFilters.max;
			});
		}
	}
</script>

<div class="flex flex-wrap mt-11 justify-center gap-6 cards">
	{#if filteredCards}
		{#each filteredCards as _card}
			<Card metadata={_card} />
		{/each}
	{:else}
		Loading...
	{/if}
</div>
