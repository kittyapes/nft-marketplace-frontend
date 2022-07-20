<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import type { ConfigurableListingProps } from '$interfaces/listing';
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
	import { frame } from '../tradeSection';
	import ListingTypeSwitch from './ListingTypeSwitch.svelte';
	import Success from './Success.svelte';

	export let options: CardOptions;

	let listingType: ListingType = 'auction';
	let maxQuantity = 1;

	let isListing = false;

	async function completeListing() {
		isListing = true;

		const flowOptions: CreateListingFlowOptions = {
			title: options.nfts[0].metadata?.name,
			description: options.nfts[0].metadata?.description,
			nfts: [
				{
					nftId: options.nfts[0].onChainId,
					collectionAddress: options.nfts[0]?.contractAddress ?? getContractData('storage').address,
					amount: listingProps.quantity || 1
				}
			],
			paymentTokenAddress: getContractData('weth').address,
			paymentTokenTicker: 'WETH',
			listingType: listingType,
			...listingProps
		};

		try {
			await createListingFlow(flowOptions);
			frame.set([Success, { successDescription: 'Successfully listed.', showMarketplaceButton: false }]);
			options.staleResource.set({ reason: 'listing-created' });
		} catch (err) {
			console.error(err);
			notifyError(err.message);
		}

		isListing = false;
	}

	let listingProps: Partial<ConfigurableListingProps> = {};
	let formErrors: string[] = [];
</script>

<div class="flex flex-col h-full pb-8 pr-6 overflow-y-auto">
	<!-- Listing Type -->
	<div class="mt-4 font-semibold">Listing Type</div>
	<div class="mt-2"><ListingTypeSwitch bind:selectedType={listingType} /></div>

	<div class="mt-4">
		<ListingPropertiesSlot>
			{#if listingType === 'sale'}
				<SaleProperties {maxQuantity} bind:props={listingProps} bind:formErrors />
			{:else if listingType === 'auction'}
				<AuctionProperties bind:props={listingProps} />
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

	<PrimaryButton class="mt-4 flex-shrink-0" disabled={!!formErrors.length || isListing} on:click={completeListing}>
		Complete Listing
		{#if isListing}
			<ButtonSpinner />
		{/if}
	</PrimaryButton>
</div>
