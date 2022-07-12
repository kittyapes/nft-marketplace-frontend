<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Back from '$icons/back_.svelte';
	import type { ApiNftData } from '$interfaces/apiNftData';
	import NftCard from '$lib/components/NftCard.svelte';
	import ListingSuccessPopup from '$lib/components/popups/ListingSuccessPopup.svelte';
	import AuctionProperties from '$lib/components/primary-listing/AuctionProperties.svelte';
	import ListingPropertiesSlot from '$lib/components/primary-listing/ListingPropertiesSlot.svelte';
	import SaleProperties from '$lib/components/primary-listing/SaleProperties.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import type { ListingType } from '$utils/api/listing';
	import { getNft } from '$utils/api/nft';
	import { createListingFlow, type CreateListingFlowOptions } from '$utils/flows/createListingFlow';
	import { getContractData } from '$utils/misc/getContract';
	import { goBack } from '$utils/navigation';
	import getUserNftBalance from '$utils/nfts/getUserNftBalance';
	import { setPopup } from '$utils/popup';
	import { notifyError } from '$utils/toast';
	import dayjs from 'dayjs';
	import { BigNumber } from 'ethers';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// URL params
	const nftId = $page.params.bundleId; // nftId is correct, bundleId is deprecated
	const listingType = $page.url.searchParams.get('type') as ListingType;

	const fetchedNftData = writable<ApiNftData>(null);

	let maxQuantity = 1;

	// Fetch NFT data on mount to show a preview
	onMount(async () => {
		// Go back to listing type selection if the listing type is not set
		if (!['sale', 'auction'].includes(listingType)) {
			goto('/create/choose-listing-format/' + nftId);
			return;
		}

		//const bundleRes = await getBundle($page.params.bundleId);
		const nftRes = await getNft(nftId);

		if (nftRes) {
			if (nftRes.tokenStandard === 'ERC1155') {
				maxQuantity = await getUserNftBalance(nftRes.contractAddress, nftRes.nftId);
			} else {
				maxQuantity = 1;
			}
		}

		fetchedNftData.set(nftRes);
	});

	let isListing = false;

	async function list() {
		if (quantity > maxQuantity) {
			notifyError(`Error: You Can Only List a Maximum of ${maxQuantity} Tokens`);
			return;
		}

		if (!quantity || quantity <= 1) {
			quantity = 1;
		}

		isListing = true;

		const flowOptions: CreateListingFlowOptions = {
			title: $fetchedNftData.name,
			description: $fetchedNftData.metadata?.description,
			duration: durationSeconds,
			// TODO, add support for addresses from external collections
			nfts: [{ nftId: $fetchedNftData.nftId, amount: BigNumber.from(quantity), collectionAddress: $fetchedNftData.contractAddress ?? getContractData('storage').address }],
			paymentTokenAddress: getContractData('weth').address,
			paymentTokenTicker: 'WETH',
			quantity: BigNumber.from(1),
			startTime: dayjs(startDateTs).isAfter(dayjs()) ? startDateTs : null,
			listingType: listingType,
			sale: {} as any,
			auction: {} as any
		};

		if (listingType === 'sale') {
			flowOptions.sale.price = price;
		} else if (listingType === 'auction') {
			flowOptions.auction.startingPrice = startingPrice;
			flowOptions.auction.reservePrice = reservePrice || startingPrice;
		}

		const { err, success } = await createListingFlow(flowOptions);

		if (err) {
			notifyError('Failed to list NFT!');
		}

		if (success) {
			setPopup(ListingSuccessPopup, { props: { viewCallback: goViewNft }, closeByOutsideClick: false });
		}

		isListing = false;
	}

	function goViewNft() {
		goto('/profile/' + $currentUserAddress + '?tab=listings');
	}

	// Listing properties
	let quantity = maxQuantity;
	let durationSeconds;
	let startDateTs;
	let price;
	let startingPrice;
	let reservePrice;

	let formValid;
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

		<div class="mt-8 pr-8">
			<ListingPropertiesSlot compact>
				{#if listingType === 'sale'}
					<SaleProperties {maxQuantity} bind:durationSeconds bind:quantity bind:startDateTs bind:price bind:formValid />
				{:else if listingType === 'auction'}
					<AuctionProperties bind:durationSeconds bind:startDateTs bind:startingPrice bind:reservePrice bind:formValid />
				{/if}
			</ListingPropertiesSlot>
		</div>

		<div class="pr-8 mt-8">
			<PrimaryButton on:click={list} disabled={!formValid || isListing}>
				List for {listingType || 'N/A'}
				{#if isListing}
					<ButtonSpinner />
				{/if}
			</PrimaryButton>
		</div>
	</div>

	<div class="p-8 border-0 border-l separator w-80">
		<div class="mb-4 text-xl uppercase">Preview</div>
		<NftCard
			options={{
				id: null,
				title: $fetchedNftData?.name,
				imageUrl: $fetchedNftData?.thumbnailUrl,
				price: price || startingPrice,
				collectionName: $fetchedNftData?.['collection']?.name ?? '',
				likeIds: [],
				likes: 0
			}}
		/>
	</div>
</div>
