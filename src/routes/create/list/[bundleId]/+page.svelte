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
			title: $fetchedNftData.name,
			description: $fetchedNftData.metadata?.description,
			// TODO, add support for addresses from external collections
			nfts: [{ nftId: $fetchedNftData.nftId, amount: listingProps.quantity || 1, collectionAddress: $fetchedNftData.contractAddress ?? getContractData('storage').address, _id: $fetchedNftData._id }],
			paymentTokenAddress: getContractData('weth').address,
			paymentTokenTicker: 'WETH',
			listingType: listingType,
			...listingProps,
		};

		try {
			await createListingFlow(flowOptions);
			setPopup(ListingSuccessPopup, { props: { viewCallback: goViewNft }, closeByOutsideClick: false });
		} catch (err) {
			console.error(err);
			notifyError('Failed to list NFT!');
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
			<span class="pr-1 font-bold text-gradient">{listingType}</span>
		</h1>

		<hr class="mt-4 separator" />

		<div class="pr-8 mt-8">
			<ListingProperties {listingType} {maxQuantity} bind:formErrors bind:props={listingProps} compact />
		</div>

		<div class="pr-8 mt-8">
			<PrimaryButton on:click={list} disabled={!!formErrors.length || isListing}>
				List for {listingType || 'N/A'}
				{#if isListing}
					<ButtonSpinner />
				{/if}
			</PrimaryButton>
		</div>
	</div>

	<div class="p-8 border-0 border-l separator w-80">
		<div class="mb-4 text-xl uppercase">Preview</div>
		<NftCard options={previewMockOptions} hideLikes />
	</div>
</div>
