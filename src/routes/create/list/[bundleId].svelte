<script lang="ts">
	import NftCard from '$lib/components/NftCard.svelte';
	import type { ListingPropName } from 'src/interfaces/drops';
	import CommonProperties from '$lib/components/create/CommonProperties.svelte';
	import { newDropProperties } from '$stores/create';
	import Back from '$icons/back_.svelte';
	import { goBack } from '$utils/navigation';
	import { postCreateListing } from '$utils/api/listing';
	import { page } from '$app/stores';
	import { notifyError, notifySuccess } from '$utils/toast';
	import Loader from '$icons/loader.svelte';
	import { contractCreateListing, LISTING_TYPE } from '$utils/contracts/listing';
	import { writable } from 'svelte/store';
	import { getNft } from '$utils/api/nft';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { getApiUrl } from '$utils/api';
	import { getAxiosConfig } from '$utils/auth/axiosConfig';
	import { goto } from '$app/navigation';
	import type { NftData } from '$interfaces/nft';
	import { HinataTokenAddress, WethContractAddress } from '$constants/contractAddresses';
	import { currentUserAddress } from '$stores/wallet';

	// URL params
	const nftId = $page.params.bundleId; // nftId is correct, bundleId is deprecated

	const typeToProperties: { [key: string]: ListingPropName[] } = {
		sale: ['price', 'startDate', 'quantity', 'duration']
	};

	const fetchedNftData = writable<NftData>(null);

	// Fetch NFT data on mount to show a preview
	onMount(async () => {
		// Go back to listing type selection if the listing type is not set
		if (!$newDropProperties.listingType) {
			goto('/create/choose-listing-format/' + nftId);
			return;
		}

		//const bundleRes = await getBundle($page.params.bundleId);
		const nftRes = await getNft(nftId);
		fetchedNftData.set(nftRes);
	});

	let currentPaymentToken: { name: string; address: string } = { name: 'ETH', address: HinataTokenAddress };

	const handleTokenChange = (event: CustomEvent) => {
		// can be uncommented once contract supports different pay tokens
		/*
		currentPaymentToken.name = event.detail.label.toUpperCase();
		currentPaymentToken.address = event.detail.value;
		*/
	};

	let isListing = false;

	async function listForSale() {
		isListing = true;

		const duration = listingPropValues.duration.value * 60 * 60 * 24;
		// Create listing on the server
		const apiCreateListingRes = await postCreateListing({
			nfts: [{ nftId: $fetchedNftData.nftId, amount: $fetchedNftData.amount }],
			paymentTokenAddress: currentPaymentToken.address,
			paymentTokenTicker: currentPaymentToken.name,
			title: $fetchedNftData.name,
			description: $fetchedNftData.metadata.description,
			listingType: $newDropProperties.listingType,
			price: listingPropValues.price,
			quantity: listingPropValues.quantity,
			startTime: listingPropValues.startDate.unix(),
			duration: duration
		});

		if (apiCreateListingRes.data.error) {
			notifyError(apiCreateListingRes.data.message);
			isListing = false;
			return;
		}

		// Create listing on chain
		const successListingOnChain = await contractCreateListing({
			payToken: currentPaymentToken.address,
			listingId: apiCreateListingRes.data.data.listingId,
			listingType: LISTING_TYPE.FIXED_PRICE,
			startingPrice: listingPropValues.price,
			startTime: listingPropValues.startDate.unix(),
			duration: duration,
			tokenIds: [$fetchedNftData.nftId],
			tokenAmounts: [$fetchedNftData.amount],
			quantity: 1
		});

		if (!successListingOnChain) {
			notifyError('Failed to create listing on chain.');
			isListing = false;
			return;
		}

		notifySuccess('Successfully created a listing.');
		isListing = false;
		goto('/profile/' + $currentUserAddress + '?tab=ACTIVE_LISTINGS');
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

		<!-- <CommonProperties class="mt-8" propNames={typeToProperties[$newDropProperties.listingType]} bind:isValid={commonPropertiesValid} bind:propValues={listingPropValues} /> -->
		<CommonProperties on:select={handleTokenChange} class="mt-8" propNames={typeToProperties['sale']} bind:isValid={commonPropertiesValid} bind:propValues={listingPropValues} />

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
		<NftCard options={{ id: null, title: $fetchedNftData?.name, imageUrl: $fetchedNftData?.thumbnailUrl }} />
	</div>
</div>
