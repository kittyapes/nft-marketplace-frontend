<script>
	import { setPopup } from '$utils/popup';
	import ConfirmListingTypePopup from '$lib/components/create/ConfirmListingTypePopup.svelte';
	import { fade } from 'svelte/transition';
	import Back from '$icons/back_.svelte';
	import { goBack } from '$utils/navigation';
	import ListingTypeButton from '$lib/components/v2/ListingTypeButton/ListingTypeButton.svelte';
	import SaleListingTypeOption from '$icons/sale-listing-type-option.svelte';
	import AuctionListingTypeOption from '$icons/auction-listing-type-option.svelte';

	const listingTypes = [
		{
			listingType: 'auction',
			title: 'Auction',
			hoverText: 'Allow other users to make bids on your NFT.',
			confirmDetail: 'Listing an NFT for Auction allows any user to bid with WETH. Select the duration and reserve price for your item. ',
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
		setPopup(ConfirmListingTypePopup, { props: dropType });
	}

	let hoveredListingType = null;
</script>

<!-- Back button -->
<button class="flex items-center mb-8 space-x-2 text-sm font-semibold btn" on:click={goBack}>
	<Back />
	<div>Go Back</div>
</button>

<h1 class="mt-8 text-3xl font-light border-t border-white pt-4">Choose Listing Format</h1>

<div class="mt-2 h-6 font-normal text-lg">
	{#if hoveredListingType}
		<div transition:fade={{ duration: 100 }}>
			{listingTypes.find((v) => v.listingType === hoveredListingType)?.hoverText || ''}
		</div>
	{/if}
</div>

<div class="flex flex-wrap justify-center gap-4 mt-24 mb-64">
	{#each listingTypes as listingType}
		<ListingTypeButton
			on:click={() => handleClick(listingType)}
			on:pointerenter={() => (hoveredListingType = listingType.listingType)}
			on:pointerleave={() => {
				if (hoveredListingType === listingType.listingType) hoveredListingType = null;
			}}
			iconComponent={listingType.iconComponent}
			title={listingType.title}
		/>
	{/each}
</div>
