<script lang="ts">
	import { browser } from '$app/environment';
	import Info from '$icons/info.v2.svelte';
	import type { ConfigurableListingProps } from '$interfaces/listing';
	import type { CardOptions } from '$interfaces/ui';
	import InfoBox from '$lib/components/InfoBox.svelte';
	import ListingProperties from '$lib/components/primary-listing/ListingProperties.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { userCreatedListing } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import type { ListingType } from '$utils/api/listing';
	import { getMarketFee } from '$utils/contracts/listing';
	import { createListingFlow, type CreateListingFlowOptions } from '$utils/flows/createListingFlow';
	import { getContractData } from '$utils/misc/getContract';
	import getUserNftBalance from '$utils/nfts/getUserNftBalance';
	import { notifyError } from '$utils/toast';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import Error from './Error.svelte';
	import ListingTypeSwitch from './ListingTypeSwitch.svelte';
	import Success from './Success.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions;

	let listingType: ListingType = 'auction';
	let maxQuantity = 1;
	let isGasless: boolean;

	let isListing = false;
	let canCreateListing = true;

	async function completeListing() {
		isListing = true;

		const flowOptions: CreateListingFlowOptions = {
			gasless: isGasless,
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

		let listSuccess: boolean;

		try {
			const res = await createListingFlow(flowOptions);

			// For handled errors, don't show the default message
			if (res?.error && res.handled) {
				listSuccess = false;
			}

			// For unhandled errors, show the default error message
			else if (res?.error) {
				throw res.error;
			}

			// Successful listing
			else {
				listSuccess = true;
			}
		} catch (err) {
			notifyError(err.message);
			dispatch('set-frame', {
				component: Error,
				props: { message: 'Failed to create listing!' },
			});
			console.error(err);
		}

		if (listSuccess) {
			dispatch('listing-created');
			dispatch('set-frame', {
				component: Success,
				props: { message: 'Listing created successfully.' },
			});
		}

		isListing = false;
		$userCreatedListing = true;
	}

	async function refreshBalance() {
		const res = await getUserNftBalance(options.nfts[0].contractAddress, options.nfts[0].onChainId);
		maxQuantity = res.balance;
	}

	$: $currentUserAddress && refreshBalance();

	let listingProps: Partial<ConfigurableListingProps> = { quantity: 1 };
	let formErrors: string[] = [];

	let _listingProperties: ListingProperties;

	onMount(() => {
		_listingProperties?.setValues({ durationSeconds: 60 * 60 * 24 });
	});
</script>

<div class="flex flex-col pb-8 pr-6 overflow-y-auto text-white aspect-1 blue-scrollbar">
	{#if canCreateListing}
		<!-- Listing Type -->
		<div class="mt-2 font-semibold">Listing Type</div>
		<div class="mt-2"><ListingTypeSwitch bind:selectedType={listingType} disabled={isListing} /></div>

		<!-- Gasless switch -->
		<div class="flex mt-8">
			<div class="flex-grow text-lg">Gasless Listing</div>
			<Toggle bind:state={isGasless} />
		</div>

		<div class="mt-6">
			<ListingProperties {listingType} {maxQuantity} bind:formErrors bind:props={listingProps} bind:this={_listingProperties} disabled={isListing} />
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
				<div class="gradient-text">
					{#if browser}
						{#await getMarketFee() then marketFee}
							{marketFee ?? 'N/A'} %
						{/await}
					{/if}
				</div>
				<div class="w-6">
					<Info />
				</div>
			</div>
		</div>

		<div class="mt-4">
			<PrimaryButton disabled={!!formErrors.length || isListing} on:click={completeListing}>
				Complete Listing
				{#if isListing}
					<ButtonSpinner />
				{/if}
			</PrimaryButton>
		</div>
	{:else}
		<div class="mt-4">
			<InfoBox>You can't create listings.</InfoBox>
		</div>
	{/if}
</div>
