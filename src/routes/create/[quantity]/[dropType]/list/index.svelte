<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import NftCard from '$lib/components/NftCard.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import { setPopup } from '$utils/popup';
	import { capitalize } from 'lodash-es';
	import ListedForSale from '../../../_lib/ListedForSale.svelte';
	import CommonProperties from './_lib/CommonProperties.svelte';
	import Royalties from './_lib/Royalties.svelte';
	import type { PropertyName } from './_lib/types';

	const tabs = ['sale', 'auction', 'raffle', 'limited-edition', 'queue-drop', 'gacha', 'admin'];
	const typeToProperties: { [key: string]: PropertyName[] } = {
		sale: ['price', 'date', 'quantity'],
		auction: ['price', 'auctionDate', 'reservePrice', 'auctionDuration', 'quantity'],
		raffle: [
			'entryTickets',
			'ticketPrice',
			'price',
			'totalTickets',
			'date',
			'quantity',
			'raffleDuration'
		],
		'limited-edition': ['entryTickets', 'price', 'claimsBegin', 'quantity', 'claimsDuration'],
		'queue-drop': ['price', 'cutPrice', 'preQueueOpens', 'queueDuration', 'quantity'],
		gacha: ['quantity', 'gachaContract']
	};

	$: listingType = $page.params.dropType;
	$: validListingType = tabs.includes(listingType);

	function humanizeType(s: string) {
		return capitalize(s.replace(/-/g, ' '));
	}

	if (browser && !validListingType) {
		// goto('/create/list/sale');
	}

	const nftName = 'Todo NFT name';
	const nftCollection = 'Todo NFT collection';
	const nftImagePreview = 'https://i.imgur.com/w3duR07.png';

	function listForSale() {
		setPopup(ListedForSale);
	}
</script>

<!-- <div class="space-x-8">
	{#each tabs as tab}
		<TabButton selected={listingType === tab} on:click={() => goto('/create/list/' + tab)}>
			{humanizeType(tab)}
		</TabButton>
	{/each}
</div> -->

<hr class="separator" />

<div class="flex mb-32">
	<div class="flex-grow">
		<h1 class="text-xl uppercase mt-8">
			<span class="italic font-light">Step 4: Setting details</span>
			|
			<span class="gradient-text font-bold italic pr-1">{$page.params.quantity}</span>
			|
			<span class="gradient-text font-bold italic pr-1">{$page.params.dropType}</span>
		</h1>

		<hr class="separator mt-4" />

		<CommonProperties class="mt-8" propNames={typeToProperties[listingType]} />

		<hr class="separator mt-8" />

		<Royalties />

		<button
			class="btn btn-gradient btn-rounded w-full mt-8 uppercase font-semibold"
			on:click={listForSale}
		>
			List for sale
		</button>
	</div>

	<div class="separator border-0 border-l p-8 w-80">
		<div class="uppercase italic text-xl mb-4">Preview</div>
		<NftCard name={nftName || 'N/A'} collectionName={nftCollection} imageUrl={nftImagePreview} />
	</div>
</div>
