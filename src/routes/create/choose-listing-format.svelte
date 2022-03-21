<script>
	import { setPopup } from '$utils/popup';
	import CardButton from '$lib/components/create/CardButton.svelte';
	import ListingType from '$lib/components/create/ListingType.svelte';
	import ConfirmListingTypePopup from '$lib/components/create/ConfirmListingTypePopup.svelte';
	import { fade } from 'svelte/transition';

	const listingTypes = [
		{
			listingType: 'sale',
			title: 'Sale',
			imgUrl: '/img/create/drop-type-sale.svg',
			hoverText: 'No description.'
		},
		{
			listingType: 'auction',
			title: 'Auction',
			imgUrl: '/img/create/drop-type-auction.svg',
			hoverText: 'Allow other users to make bids on your NFT.',
			disabled: false
		},
		{
			listingType: 'raffle',
			title: 'Raffle',
			imgUrl: '/img/create/drop-type-raffle.svg',
			hoverText: 'No description',
			disabled: true
		}
	];

	function handleClick(dropType) {
		setPopup(ConfirmListingTypePopup, { props: dropType });
	}

	let hoveredListingType = null;
</script>

<hr class="separator" />

<h1 class="italic font-light uppercase mt-8 text-xl">Step 3: Choose listing format</h1>

<div class="font-poppins text-[#585858] mt-8 h-6">
	{#if hoveredListingType}
		<div transition:fade={{ duration: 100 }}>
			{listingTypes.find((v) => v.listingType === hoveredListingType)?.hoverText || ''}
		</div>
	{/if}
</div>

<div class="grid grid-cols-3 mt-8 gap-16 mb-64">
	{#each listingTypes as listingType}
		<CardButton
			on:click={() => handleClick(listingType)}
			on:pointerenter={() => (hoveredListingType = listingType.listingType)}
			on:pointerleave={() => {
				if (hoveredListingType === listingType.listingType) hoveredListingType = null;
			}}
			disabled={listingType.disabled}
		>
			<ListingType imgUrl={listingType.imgUrl} title={listingType.title} />
		</CardButton>
	{/each}
</div>
