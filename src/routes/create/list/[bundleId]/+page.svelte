<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Back from '$icons/back_.svelte';
	import type { ApiNftData } from '$interfaces/apiNftData';
	import type { ConfigurableListingProps } from '$interfaces/listing';
	import type { CardOptions } from '$interfaces/ui';
	import NftCard from '$lib/components/NftCard.svelte';
	import ListingSuccessPopup from '$lib/components/popups/ListingSuccessPopup.svelte';
	import ListingProperties from '$lib/components/primary-listing/ListingProperties.svelte';
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
	import { capitalize } from 'lodash-es';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Spinner from '$lib/components/v2/Spinner/Spinner.svelte';

	// URL params
	const nftId = $page.params.bundleId; // nftId is correct, bundleId is deprecated
	const isGasless = $page.url.searchParams.get('gasless') === '1';

	let listingType = $page.url.searchParams.get('type') as ListingType;

	console.info('Listing as gasless:', isGasless);

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
				// TODO debug and remove || 1 hotfix
				const balance = await getUserNftBalance(nftRes.contractAddress, nftRes.nftId);
				console.warn('[Hotfix]: Owned quantity is probably incorrect!', balance);
				maxQuantity = balance.balance || 1;
			} else {
				maxQuantity = 1;
			}
		}

		fetchedNftData.set(nftRes);
	});

	let isListing = false;

	async function list() {
		if (listingProps.quantity > maxQuantity) {
			notifyError(`Error: You Can Only List a Maximum of ${maxQuantity} Tokens`);
			return;
		}

		isListing = true;

		const flowOptions: CreateListingFlowOptions = {
			gasless: isGasless,
			title: $fetchedNftData.name,
			description: $fetchedNftData.metadata?.description,
			// TODO, add support for addresses from external collections
			nfts: [{ nftId: $fetchedNftData.nftId, amount: listingProps.quantity || 1, collectionAddress: $fetchedNftData.contractAddress ?? getContractData('storage').address, _id: $fetchedNftData._id }],
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
			listSuccess = false;

			console.error(err);
			notifyError('Sorry, an unexpected error has occured. Your NFT could not be listed.');
		}

		if (listSuccess) {
			setPopup(ListingSuccessPopup, { props: { viewCallback: goViewNft }, closeByOutsideClick: false });
		}

		isListing = false;
	}

	function goViewNft() {
		goto('/profile/' + $currentUserAddress + '?tab=listings');
	}

	let formErrors: string[] = [];
	let listingProps: Partial<ConfigurableListingProps> = {};

	// Preview
	$: previewMockOptions = {
		resourceType: 'nft',
		rawResourceData: null,
		nfts: [
			{
				name: $fetchedNftData?.name || 'No Title',
				thumbnailUrl: $fetchedNftData?.thumbnailUrl || $fetchedNftData?.assetUrl,
				collectionData: { name: $fetchedNftData?.collectionName },
			},
		],
	} as CardOptions;

	function setListingType(listingType_: string) {
		$page.url.searchParams.set('type', listingType_);
		goto($page.url);

		listingType = listingType_ as ListingType;
	}
</script>

<!-- Back button -->
<button class="flex items-center mt-8 space-x-2 text-sm btn" on:click={goBack}>
	<Back />
	<div>Go Back</div>
</button>

<div class="mt-8 font-semibold gap-4 flex mb-1">
	{#each ['sale', 'auction'] as t}
		{@const isSelected = t === listingType}
		<button class="uppercase relative" class:text-gradient={isSelected} on:click={() => setListingType(t)}>
			{capitalize(t)}

			{#if isSelected}
				<div class="gradient-border-bg h-[2px] absolute w-full bottom-[-5px]" />
			{/if}
		</button>
	{/each}
</div>

<div class="flex mb-32 border-t pt-2">
	<div class="flex-grow">
		<h1 class="mt-8 text-2xl">
			Setting Details |
			{capitalize(listingType)}
		</h1>

		<div class="pr-8 mt-8">
			<ListingProperties {listingType} {maxQuantity} bind:formErrors bind:props={listingProps} compact />
		</div>

		<div class="pr-8 mt-8">
			<PrimaryButton on:click={list} disabled={!!formErrors.length || isListing}>
				{#if isListing}
					<div class="w-8 absolute left-2">
						<Spinner />
					</div>
				{/if}

				List for {listingType || 'N/A'}
			</PrimaryButton>
		</div>
	</div>

	<div class="p-8 border-0 border-l border-white separator w-96">
		<div class="mb-4 text-xl uppercase">Preview</div>
		<NftCard options={previewMockOptions} hideLikes disabled />
	</div>
</div>
