<script lang="ts">
	import { setPopup } from '$utils/popup';
	import ConfirmListingTypePopup from '$lib/components/create/ConfirmListingTypePopup.svelte';
	import { fade } from 'svelte/transition';
	import Back from '$icons/back_.svelte';
	import { goBack } from '$utils/navigation';
	import ListingTypeButton from '$lib/components/v2/ListingTypeButton/ListingTypeButton.svelte';
	import SaleListingTypeOption from '$icons/sale-listing-type-option.svelte';
	import AuctionListingTypeOption from '$icons/auction-listing-type-option.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import Info from '$icons/info.v2.svelte';

	const listingTypes = [
		{
			listingType: 'auction',
			title: 'Auction',
			hoverText: 'Allow other users to make bids on your NFT.',
			confirmDetail:
				'Listing an NFT for Auction allows any user to bid with WETH. Select the duration and reserve price for your item. ',
			iconComponent: AuctionListingTypeOption,
		},
		{
			listingType: 'sale',
			title: 'Sale',
			hoverText: 'Allows users to sell an NFT for a Fixed Cost and Time-Frame.',
			confirmDetail: 'Sell your NFT for a Fixed price of your choosing!',
			iconComponent: SaleListingTypeOption,
		},
	];

	function handleClick(dropType) {
		setPopup(ConfirmListingTypePopup, { props: { ...dropType, gasless } });
	}

	let hoveredListingType = null;

	let gasless: boolean;
</script>

<!-- Back button -->
<button class="flex items-center my-8 space-x-2 text-sm font-semibold btn" on:click={goBack}>
	<Back />
	<div>Go Back</div>
</button>

<h1 class="mt-8 text-3xl font-light border-t border-white pt-4">Choose Listing Format</h1>

<div class="mt-4 h-6 font-normal text-lg">
	{#if hoveredListingType}
		<div transition:fade={{ duration: 100 }}>
			{listingTypes.find((v) => v.listingType === hoveredListingType)?.hoverText || ''}
		</div>
	{/if}
</div>

<div class="flex mt-4 gap-x-4 items-center">
	<div class="flex-grow text-lg">Gasless Listing</div>
	<Toggle bind:state={gasless} />

	<!-- WARNING: This should be a hover, add a hover when we make this enabled -->
	<Info />
</div>

<div class="flex flex-wrap justify-center gap-4 mt-24 mb-64">
	<ListingTypeButton
		on:click={() => handleClick(listingTypes[0])}
		on:pointerenter={() => (hoveredListingType = 'auction')}
		on:pointerleave={() => {
			if (hoveredListingType === 'auction') hoveredListingType = null;
		}}
		iconComponent={AuctionListingTypeOption}
		title="Auction"
	/>

	<ListingTypeButton
		on:click={() => handleClick(listingTypes[1])}
		on:pointerenter={() => (hoveredListingType = 'sale')}
		on:pointerleave={() => {
			if (hoveredListingType === 'sale') hoveredListingType = null;
		}}
		iconComponent={SaleListingTypeOption}
		title={'Sale'}
	/>
</div>
