<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import type { CardOptions } from '$lib/components/NftCard.svelte';
	import AuctionProperties from '$lib/components/primary-listing/AuctionProperties.svelte';
	import ListingPropertiesSlot from '$lib/components/primary-listing/ListingPropertiesSlot.svelte';
	import SaleProperties from '$lib/components/primary-listing/SaleProperties.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import type { ListingType } from '$utils/api/listing';
	import { createListingFlow, type CreateListingFlowOptions } from '$utils/flows/createListingFlow';
	import { getContractData } from '$utils/misc/getContract';
	import { notifyError } from '$utils/toast';
	import dayjs from 'dayjs';
	import { BigNumber } from 'ethers';
	import { createEventDispatcher } from 'svelte';
	import ListingTypeSwitch from './ListingTypeSwitch.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;

	let listingType: ListingType = 'auction';
	let maxQuantity = 1;

	let isListing = false;

	async function completeListing() {
		isListing = true;

		const flowOptions: CreateListingFlowOptions = {
			title: options.nfts[0].metadata?.name,
			description: options.nfts[0].metadata?.description,
			duration: durationSeconds,
			nfts: [{ nftId: options.nfts[0].onChainId, amount: BigNumber.from(quantity || 1), collectionAddress: options.nfts[0]?.contractAddress ?? getContractData('storage').address }],
			paymentTokenAddress: getContractData('weth').address,
			paymentTokenTicker: 'WETH',
			quantity: BigNumber.from(1),
			startTime: startDateTs,
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

		const { err } = await createListingFlow(flowOptions);

		if (err) {
			console.error(err);
			notifyError(err.message);
		} else {
			dispatch('set-state', { name: 'success', props: { successDescription: 'Successfully listed.', showMarketplaceButton: false } });
		}

		isListing = false;
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

<div class="flex flex-col h-full pb-8 pr-6 overflow-y-auto">
	<!-- Listing Type -->
	<div class="mt-4 font-semibold">Listing Type</div>
	<div class="mt-2"><ListingTypeSwitch bind:selectedType={listingType} /></div>

	<div class="mt-4">
		<ListingPropertiesSlot>
			{#if listingType === 'sale'}
				<SaleProperties {maxQuantity} bind:durationSeconds bind:quantity bind:startDateTs bind:price bind:formValid />
			{:else if listingType === 'auction'}
				<AuctionProperties bind:durationSeconds bind:startDateTs bind:startingPrice bind:reservePrice bind:formValid />
			{/if}
		</ListingPropertiesSlot>
	</div>

	<div class="flex-grow" />

	<!-- Fees -->
	<div class="mt-4 font-semibold">Fees</div>
	<div class="grid gap-2 mt-2 font-semibold" style:grid-template-columns="auto 6rem">
		<div>Creator Royalties:</div>
		<div class="flex justify-end space-x-3">
			<div class="">
				{(options.nfts[0].collectionData.royalties?.reduce((acum, value) => acum + Number(value.fees ?? 0), 0) || 0) + ' %'}
			</div>
			<div class="w-6">
				<Info />
			</div>
		</div>

		<div class="gradient-text">Hinata Fees:</div>
		<div class="flex justify-end space-x-3">
			<div class="gradient-text">0%</div>
			<div class="w-6">
				<Info />
			</div>
		</div>
	</div>

	<PrimaryButton class="mt-4 flex-shrink-0" disabled={!formValid || isListing} on:click={completeListing}>
		Complete Listing
		{#if isListing}
			<ButtonSpinner />
		{/if}
	</PrimaryButton>
</div>
