<script lang="ts">
	import NftCard from '$lib/components/NftCard.svelte';
	import type { ListingPropName } from 'src/interfaces/drops';
	import { setPopup } from '$utils/popup';
	import CommonProperties from '$lib/components/create/CommonProperties.svelte';
	import Royalties from '$lib/components/create/Royalties.svelte';
	import { newDropProperties } from '$stores/create';
	import ConfirmListingPopup from '$lib/components/create/ConfirmListingPopup.svelte';
	import Back from '$icons/back_.svelte';
	import { goBack } from '$utils/navigation';
	import { postCreateListing } from '$utils/api/listing';
	import { page } from '$app/stores';
	import { currentUserAddress } from '$stores/wallet';
	import { makeErrorHandler, notifyError, notifySuccess } from '$utils/toast';
	import Loader from '$icons/loader.svelte';
	import { contractCreateListing, LISTING_TYPE } from '$utils/contracts/listing';
	import { writable } from 'svelte/store';
	import { getNft, GetNftResponse } from '$utils/api/nft';
	import { onMount } from 'svelte';
	import { getBundle } from '$utils/api/bundle';

	const typeToProperties: { [key: string]: ListingPropName[] } = {
		sale: ['price', 'date'],
		auction: ['price', 'auctionDate', 'reservePrice', 'auctionDuration'],
		raffle: ['entryTickets', 'ticketPrice', 'price', 'totalTickets', 'date', 'raffleDuration'],
		'limited-edition': ['entryTickets', 'price', 'claimsBegin', 'claimsDuration'],
		'queue-drop': ['price', 'cutPrice', 'preQueueOpens', 'queueDuration'],
		gacha: ['gachaContract']
	};

	// Fetch NFT data on mount to show a preview
	const fetchedNftData = writable<GetNftResponse>(null);

	onMount(async () => {
		const bundleRes = await getBundle($page.params.bundleId);
		const nftRes = await getNft(bundleRes.nft_ids[0]);

		fetchedNftData.set(nftRes);

		console.log(nftRes);
	});

	let isListing = false;

	async function listForSale() {
		isListing = true;

		// Create listing on the server
		const apiCreateListingRes = await postCreateListing({
			bundleId: $page.params.bundleId,
			creator: $currentUserAddress,
			listingType: 'UNIQUE_FIXED_PRICE',
			price: listingPropValues.price,
			startedAt: listingPropValues.date
		});

		if (!apiCreateListingRes) {
			notifyError('Failed to create listing.');
			isListing = false;
			return;
		}

		// Create listing on chain
		const successListingOnChain = await contractCreateListing({
			bundleId: $page.params.bundleId,
			payToken: '0x0000000000000000000000000000000000000000',
			listingType: LISTING_TYPE.FIXED_PRICE,
			startingPrice: listingPropValues.price,
			endingPrice: listingPropValues.price,
			duration: 60 * 60 * 24,
			quantity: 1
		});

		if (!successListingOnChain) {
			notifyError('Failed to create listing on chain.');
			isListing = false;
			return;
		}

		notifySuccess('Successfully created listing.');

		isListing = false;
	}

	let listingPropValues: Partial<Record<ListingPropName, any>>;

	let royaltiesValid = true; // TODO remove true when re-adding royalties
	let commonPropertiesValid;

	$: formValid = royaltiesValid && commonPropertiesValid;
</script>

<!-- Back button -->
<button class="btn flex items-center space-x-2 uppercase font-semibold mt-16 mb-8 text-sm" on:click={goBack}>
	<Back />
	<div>Go Back</div>
</button>

<hr class="separator" />

<div class="flex mb-32">
	<div class="flex-grow">
		<h1 class="text-xl uppercase mt-8">
			<span class="italic font-light">Step 3: Setting details</span>
			|
			<span class="gradient-text font-bold italic pr-1">{$newDropProperties.listingType}</span>
		</h1>

		<hr class="separator mt-4" />

		<CommonProperties class="mt-8" propNames={typeToProperties[$newDropProperties.listingType]} bind:isValid={commonPropertiesValid} bind:propValues={listingPropValues} />

		<!-- <hr class="separator mt-8" /> -->

		<!-- <Royalties bind:isValid={royaltiesValid} /> -->

		<div class="pr-8">
			<button class="btn btn-gradient btn-rounded w-full mt-8 uppercase font-semibold" on:click={listForSale} disabled={!formValid || isListing}>
				List for {$newDropProperties.listingType || 'N/A'}
			</button>
		</div>

		{#if isListing}
			<Loader class="w-8 h-8 mx-1" />
		{/if}
	</div>

	<div class="separator border-0 border-l p-8 w-80">
		<div class="uppercase italic text-xl mb-4">Preview</div>
		<NftCard name={$fetchedNftData?.name || 'N/A'} collectionName="No collection" imageUrl={$fetchedNftData?.imageUrl} />
	</div>
</div>
