<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import type { ConfigurableListingProps } from '$interfaces/listing';
	import type { CardOptions } from '$interfaces/ui';
	import ListingProperties from '$lib/components/primary-listing/ListingProperties.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import type { ListingType } from '$utils/api/listing';
	import { createListingFlow, type CreateListingFlowOptions } from '$utils/flows/createListingFlow';
	import { getContractData } from '$utils/misc/getContract';
	import getUserNftBalance from '$utils/nfts/getUserNftBalance';
	import { notifyError } from '$utils/toast';
	import { createEventDispatcher } from 'svelte';
	import { frame } from '../tradeSection';
	import ListingTypeSwitch from './ListingTypeSwitch.svelte';
	import Success from './Success.svelte';

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
			nfts: [
				{
					_id: options.nfts[0].databaseId,
					nftId: options.nfts[0].onChainId,
					collectionAddress: options.nfts[0]?.contractAddress ?? getContractData('storage').address,
					amount: listingProps.quantity || 1,
				},
			],
			paymentTokenAddress: getContractData('weth').address,
			paymentTokenTicker: 'WETH',
			listingType: listingType,
			...listingProps,
		};

		try {
			await createListingFlow(flowOptions);
			frame.set([Success, { successDescription: 'Successfully listed.', showMarketplaceButton: false }]);
			dispatch('listing-created');
		} catch (err) {
			console.error(err);
			notifyError(err.message);
		}

		isListing = false;
	}

	async function refreshBalance() {
		const res = await getUserNftBalance(options.nfts[0].contractAddress, options.nfts[0].onChainId);
		maxQuantity = res.balance;
	}

	$: $currentUserAddress && refreshBalance();

	let listingProps: Partial<ConfigurableListingProps> = { quantity: 1 };
	let formErrors: string[] = [];
</script>

<div class="flex flex-col h-full pb-8 pr-6 overflow-y-auto">
	<!-- Listing Type -->
	<div class="mt-4 font-semibold">Listing Type</div>
	<div class="mt-2"><ListingTypeSwitch bind:selectedType={listingType} /></div>

	<div class="mt-4">
		<ListingProperties {listingType} {maxQuantity} bind:formErrors bind:props={listingProps} />
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

	<PrimaryButton class="flex-shrink-0 mt-4" disabled={!!formErrors.length || isListing} on:click={completeListing}>
		Complete Listing
		{#if isListing}
			<ButtonSpinner />
		{/if}
	</PrimaryButton>
</div>
