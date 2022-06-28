<script>
	import { setPopup } from '$utils/popup';
	import CardButton from '$lib/components/create/CardButton.svelte';
	import ListingType from '$lib/components/create/ListingType.svelte';
	import ConfirmListingTypePopup from '$lib/components/create/ConfirmListingTypePopup.svelte';
	import { fade } from 'svelte/transition';
	import Back from '$icons/back_.svelte';
	import { goBack } from '$utils/navigation';

	const listingTypes = [
		{
			listingType: 'sale',
			title: 'Sale',
			imgUrl: '/img/create/drop-type-sale.svg',
			hoverText: 'No description.',
			show: () => true
		},
		{
			listingType: 'auction',
			title: 'Auction',
			imgUrl: '/img/create/drop-type-auction.svg',
			hoverText: 'Allow other users to make bids on your NFT.',
			show: () => true
		},
		{
			listingType: 'raffle',
			title: 'Raffle',
			imgUrl: '/img/create/drop-type-raffle.svg',
			hoverText: 'No description',
			show: () => false
		}
	];

	function handleClick(dropType) {
		setPopup(ConfirmListingTypePopup, { props: dropType });
	}

	let hoveredListingType = null;
</script>

<!-- Back button -->
<button class="flex items-center mt-16 mb-8 space-x-2 text-sm font-semibold uppercase btn" on:click={goBack}>
	<Back />
	<div>Go Back</div>
</button>

<hr class="separator" />

<h1 class="mt-8 text-xl font-light uppercase">Step 2: Choose listing format</h1>

<div class="font-poppins text-[#585858] mt-8 h-6">
	{#if hoveredListingType}
		<div transition:fade={{ duration: 100 }}>
			{listingTypes.find((v) => v.listingType === hoveredListingType)?.hoverText || ''}
		</div>
	{/if}
</div>

<div class="flex flex-wrap justify-center gap-16 mt-8 mb-64">
	{#each listingTypes as listingType}
		{#if listingType.show?.()}
			<div class="w-64">
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
			</div>
		{/if}
	{/each}
</div>
