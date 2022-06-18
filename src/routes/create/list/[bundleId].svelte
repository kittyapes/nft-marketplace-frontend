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
	import { parseEther } from 'ethers/lib/utils.js';
	import dayjs from 'dayjs';

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

		let startTimestamp: number;

		if (listingPropValues.startDate.unix() <= dayjs().unix()) {
			startTimestamp = dayjs().unix() + 10_000;
		} else {
			startTimestamp = listingPropValues.startDate();
		}

		const duration = listingPropValues.duration.value * 60 * 60 * 24;
		// Create listing on the server
		const apiCreateListingRes = await postCreateListing({
			nfts: [{ nftId: $fetchedNftData.nftId, amount: $fetchedNftData.amount }],
			paymentTokenAddress: currentPaymentToken.address,
			paymentTokenTicker: currentPaymentToken.name,
			title: $fetchedNftData.name,
			description: $fetchedNftData.metadata.description,
			listingType: $newDropProperties.listingType,
			price: parseEther(listingPropValues.price.toString()).toString(),
			quantity: listingPropValues.quantity,
			startTime: startTimestamp,
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
<button class="flex items-center mt-16 mb-8 space-x-2 text-sm font-semibold uppercase btn" on:click={goBack}>
	<Back />
	<div>Go Back</div>
</button>

<hr class="separator" />

<div class="flex mb-32">
	<div class="flex-grow">
		<h1 class="mt-8 text-xl uppercase">
			<span class="italic font-light">Step 3: Setting details</span>
			|
			<span class="pr-1 italic font-bold gradient-text">{$newDropProperties.listingType}</span>
		</h1>

		<hr class="mt-4 separator" />

		<!-- <CommonProperties class="mt-8" propNames={typeToProperties[$newDropProperties.listingType]} bind:isValid={commonPropertiesValid} bind:propValues={listingPropValues} /> -->
		<CommonProperties on:select={handleTokenChange} class="mt-8" propNames={typeToProperties['sale']} bind:isValid={commonPropertiesValid} bind:propValues={listingPropValues} />

		<!-- <hr class="mt-8 separator" /> -->

		<!-- <Royalties bind:isValid={royaltiesValid} /> -->

		<div class="pr-8">
			<button class="w-full mt-8 font-semibold uppercase btn btn-gradient btn-rounded" on:click={listForSale} disabled={!formValid || isListing}>
				List for {$newDropProperties.listingType || 'N/A'}
			</button>
		</div>

		{#if isListing}
			<Loader class="w-8 h-8 mx-1" />
		{/if}
	</div>

	<div class="p-8 border-0 border-l separator w-80">
		<div class="mb-4 text-xl italic uppercase">Preview</div>
		<NftCard options={{ id: null, title: $fetchedNftData?.name, imageUrl: $fetchedNftData?.thumbnailUrl }} />
	</div>
</div>
