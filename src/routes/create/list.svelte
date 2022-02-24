<script lang="ts">
	import { page } from '$app/stores';
	import NftCard from '$lib/components/NftCard.svelte';
	import type { DropPropertyName } from '$lib/interfaces/drops';
	import { setPopup } from '$utils/popup';
	import CommonProperties from '$lib/components/create/CommonProperties.svelte';
	import ListNftConfirm from '$lib/components/create/ContinueListingPopup.svelte';
	import Royalties from '$lib/components/create/Royalties.svelte';
	import { newDropProperties } from '$stores/create';
	import ConfirmListingPopup from '$lib/components/create/ConfirmListingPopup.svelte';

	const typeToProperties: { [key: string]: DropPropertyName[] } = {
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

	const nftName = 'Todo NFT name';
	const nftCollection = 'Todo NFT collection';
	const nftImagePreview = 'https://i.imgur.com/w3duR07.png';

	function listForSale() {
		setPopup(ConfirmListingPopup);
	}
</script>

<hr class="separator" />

<div class="flex mb-32">
	<div class="flex-grow">
		<h1 class="text-xl uppercase mt-8">
			<span class="italic font-light">Step 4: Setting details</span>
			|
			<span class="gradient-text font-bold italic pr-1">{$newDropProperties.quantity}</span>
			|
			<span class="gradient-text font-bold italic pr-1">{$newDropProperties.listingType}</span>
		</h1>

		<hr class="separator mt-4" />

		<CommonProperties class="mt-8" propNames={typeToProperties[$newDropProperties.listingType]} />

		<hr class="separator mt-8" />

		<Royalties />

		<div class="pr-8">
			<button
				class="btn btn-gradient btn-rounded w-full mt-8 uppercase font-semibold"
				on:click={listForSale}
			>
				List for sale
			</button>
		</div>
	</div>

	<div class="separator border-0 border-l p-8 w-80">
		<div class="uppercase italic text-xl mb-4">Preview</div>
		<NftCard name={nftName || 'N/A'} collectionName={nftCollection} imageUrl={nftImagePreview} />
	</div>
</div>
