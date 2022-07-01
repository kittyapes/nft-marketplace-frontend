<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { HinataMarketplaceStorageContractAddress, HinataTokenAddress } from '$constants/contractAddresses';
	import Back from '$icons/back_.svelte';
	import Loader from '$icons/loader.svelte';
	import type { ApiNftData } from '$interfaces/apiNftData';
	import CommonProperties from '$lib/components/create/CommonProperties.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import type { ListingType } from '$utils/api/listing';
	import { getNft } from '$utils/api/nft';
	import { getTokenDetails } from '$utils/contracts/token';
	import { createListingFlow, type CreateListingFlowOptions } from '$utils/flows/createListingFlow';
	import { contractGetTokenAddress, getTokenAddress } from '$utils/misc/getTokenAddress';
	import { goBack } from '$utils/navigation';
	import dayjs from 'dayjs';
	import { BigNumber } from 'ethers';
	import { parseUnits } from 'ethers/lib/utils.js';
	import type { ListingPropName } from 'src/interfaces/drops';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// URL params
	const nftId = $page.params.bundleId; // nftId is correct, bundleId is deprecated
	const listingType = $page.url.searchParams.get('type') as ListingType;

	const typeToProperties: { [key: string]: ListingPropName[] } = {
		sale: ['price', 'startDate', 'quantity', 'duration'],
		auction: ['startDate', 'reservePrice', 'duration']
	};

	const fetchedNftData = writable<ApiNftData>(null);

	// Fetch NFT data on mount to show a preview
	onMount(async () => {
		// Go back to listing type selection if the listing type is not set
		if (!['sale', 'auction'].includes(listingType)) {
			goto('/create/choose-listing-format/' + nftId);
			return;
		}

		//const bundleRes = await getBundle($page.params.bundleId);
		const nftRes = await getNft(nftId);
		fetchedNftData.set(nftRes);
	});

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
			startTimestamp = dayjs().unix() + 10;
		} else {
			startTimestamp = listingPropValues.startDate.unix();
		}

		const duration = listingPropValues.duration.value * 60 * 60 * 24;

		console.log($fetchedNftData);

		const flowOptions: CreateListingFlowOptions = {
			title: $fetchedNftData.name,
			description: $fetchedNftData.metadata?.description,
			duration,
			// TODO, add support for addresses from external collections
			nfts: [{ nftId: $fetchedNftData.nftId, amount: BigNumber.from(1), collectionAddress: HinataMarketplaceStorageContractAddress }],
			paymentTokenAddress: await contractGetTokenAddress(listingPropValues.token.label),
			paymentTokenTicker: listingPropValues.token.label,
			quantity: BigNumber.from(1),
			startTime: startTimestamp,
			listingType: listingType,
			sale: {} as any,
			auction: {} as any
		};

		const token = await getTokenDetails(await contractGetTokenAddress(listingPropValues.token.label));

		if (listingType === 'sale') {
			flowOptions.sale.price = listingPropValues.price.toString();
		} else if (listingType === 'auction') {
			// HOTFIX, assigning reservePrice to startingPrice, because that's what the contract works with
			flowOptions.auction.startingPrice = listingPropValues.reservePrice.toString();
		}

		const { err, success } = await createListingFlow(flowOptions);

		if (success) {
			goto('/profile/' + $currentUserAddress + '?tab=listings');
		}

		isListing = false;
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
			<span class="font-light">Step 3: Setting details</span>
			|
			<span class="pr-1 font-bold gradient-text">{listingType}</span>
		</h1>

		<hr class="mt-4 separator" />

		<CommonProperties on:select={handleTokenChange} class="mt-8" propNames={typeToProperties[listingType]} bind:isValid={commonPropertiesValid} bind:propValues={listingPropValues} />

		<!-- <hr class="mt-8 separator" /> -->

		<!-- <Royalties bind:isValid={royaltiesValid} /> -->

		<div class="pr-8">
			<button class="w-full mt-8 font-semibold uppercase btn btn-gradient btn-rounded" on:click={listForSale} disabled={!formValid || isListing}>
				List for {listingType || 'N/A'}
			</button>
		</div>

		{#if isListing}
			<Loader class="w-8 h-8 mx-1" />
		{/if}
	</div>

	<div class="p-8 border-0 border-l separator w-80">
		<div class="mb-4 text-xl uppercase">Preview</div>
		<NftCard
			options={{
				id: null,
				title: $fetchedNftData?.name,
				imageUrl: $fetchedNftData?.thumbnailUrl,
				price: listingPropValues?.price,
				collectionName: $fetchedNftData?.['collection']?.name ?? '',
				likeIds: [],
				likes: 0
			}}
		/>
	</div>
</div>
