<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { acceptedImages, acceptedVideos } from '$constants';
	import Back from '$icons/back_.svelte';
	import type { NftDraft } from '$interfaces/nft/nftDraft';
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import FormErrorList from '$lib/components/FormErrorList.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import NftMintProgressPopup from '$lib/components/popups/NftMintProgressPopup.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import { nftDraft } from '$stores/create';
	import { profileData } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { adaptCollectionToMintingDropdown } from '$utils/adapters/adaptCollectionToMintingDropdown';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { fetchProfileData } from '$utils/api/profile';
	import { newBundleData, type NewBundleData } from '$utils/create';
	import { createNFTOnAPI, createNFTOnChain } from '$utils/create/createNFT';
	import { getNftId } from '$utils/create/getNftId';
	import { getContract } from '$utils/misc/getContract';
	import { goBack } from '$utils/navigation';
	import { setPopup, updatePopupProps } from '$utils/popup';
	import { notifyError } from '$utils/toast';
	import { writable } from 'svelte/store';
	import type { CardOptions } from '$interfaces/ui';

	const dragDropText = 'Drag and drop an image <br> here, or click to browse';
	const generalCollection = writable<{ label: string; value: string; iconUrl: string; collectionAddress: string }>(null);

	let dumpDraft = false;

	let selectedCollectionId: string;
	// for displaying in the collection dropdown
	let selectedCollectionRow;

	let nftData: Partial<NftDraft> = {
		name: '' || $nftDraft?.name,
		quantity: 1 || $nftDraft?.quantity,
		collectionName: 'Hinata General Collection',
		description: $nftDraft?.description,
		assetPreview: $nftDraft?.assetPreview,
		thumbnailPreview: $nftDraft?.thumbnailPreview,
		thumbnailBlob: $nftDraft?.thumbnailBlob,
		assetBlob: $nftDraft?.assetBlob
	};

	const formValidity = writable<Partial<{ [K in keyof NftDraft]: any }>>({});

	const availableCollections = writable<{ label: string; value: string; iconUrl: string; collectionAddress: string }[]>([]);

	beforeNavigate(() => {
		dumpDraft ? nftDraft.set(null) : nftDraft.set(nftData);
	});

	let isLoadingCollections = false;

	async function prepData() {
		if (!$currentUserAddress) return;

		isLoadingCollections = true;

		// Fetch general collection
		let genColl = await apiSearchCollections({ collectionAddress: getContract('storage', true).address });
		genColl = genColl.map(adaptCollectionToMintingDropdown);
		generalCollection.set(genColl[0]);

		profileData.set(await fetchProfileData($currentUserAddress));

		let collections: Collection[] = [];
		let page = 1;

		if ($nftDraft?.collectionName) nftData.collectionName = $nftDraft?.collectionName;

		while (true) {
			const beforeLength = collections.length;

			collections.push(...(await apiSearchCollections({ creator: $currentUserAddress, page })));

			if (beforeLength === collections.length) break;
			page++;
		}

		if (nftData.collectionName) {
			let selectedCollection = collections.filter((c) => c.name === nftData.collectionName)[0];

			if (selectedCollection) {
				selectedCollectionRow = adaptCollectionToMintingDropdown(selectedCollection);
				selectedCollectionId = selectedCollection.id;
			} else if (nftData.collectionName === 'Hinata General Collection' && $generalCollection?.value) {
				selectedCollectionRow = $generalCollection;
				selectedCollectionId = $generalCollection.value;
			}
		}

		if ($generalCollection) {
			$availableCollections = [$generalCollection, ...collections.filter((c) => c.slug).map(adaptCollectionToMintingDropdown)];
		} else {
			$availableCollections = collections.filter((c) => c.slug).map(adaptCollectionToMintingDropdown);
		}

		isLoadingCollections = false;
	}

	$: $currentUserAddress && prepData();

	async function mintAndContinue() {
		// Keep for skipping mint
		// goto('/create/choose-listing-format');
		// return;

		newBundleData.set({} as NewBundleData);
		const progress = writable(0);
		const popupHandler = setPopup(NftMintProgressPopup, { props: { progress, id: '' }, closeByOutsideClick: false });

		const nftId = await getNftId();
		console.info('[Create] Using new NFT contract ID:', nftId);

		// Create NFT on the server
		const selectedCollection = $availableCollections.find((c) => c.value === selectedCollectionId);

		const createNftRes = await createNFTOnAPI({
			description: nftData.description,
			amount: nftData.quantity,
			name: nftData.name,
			creator: $currentUserAddress,
			thumbnail: nftData.thumbnailBlob,
			asset: nftData.assetBlob,
			collectionId: selectedCollection.value
		});

		if (!createNftRes) {
			popupHandler.close();
			return;
		}

		updatePopupProps(popupHandler.id, { progress, id: createNftRes._id });

		//add NFT to selected collection
		// const addNftsToCollectionRes = await addNftsToCollection([createNftRes.nftId], selectedCollectionId);

		progress.set(50);

		// create NFT on chain
		try {
			await createNFTOnChain({
				id: createNftRes.nftId.toString(),
				amount: nftData.quantity.toString(),
				collectionAddress: selectedCollection.collectionAddress
			});
		} catch (err) {
			notifyError('Failed to create NFT on chain!');
			popupHandler.close();
			throw err;
		}

		newBundleData.update((data) => {
			return { ...data, id: createNftRes._id };
		});

		progress.set(100);
		dumpDraft = true;
	}

	const handleCollectionSelection = (event) => {
		// Skip this function during collection loading
		if (event.detail?.label === 'Create new collection') {
			goto(event.detail?.value);
		} else if ($availableCollections.length < 2) return;
		else {
			nftData.collectionName = event.detail?.label;
			selectedCollectionId = event.detail?.value;
		}
	};

	$: quantityValid = nftData.quantity > 0;
	$: inputValid = nftData.name && nftData.name.length <= 25 && selectedCollectionId && nftData.assetPreview && nftData.thumbnailPreview && quantityValid;

	$: if (nftData) {
		$formValidity.name = !!nftData.name ? (nftData.name.length > 25 ? 'Name Cannot be more than 25 characters' : true) : !nftData.name ? 'Name is Required' : true;
		// Always makesure item is integer
		if (nftData.quantity) {
			nftData.quantity = parseInt(nftData.quantity.toString());
		}
		$formValidity.quantity = !!nftData.quantity && nftData.quantity > 0 ? true : !nftData.quantity ? 'NFT quantity must be a minimum of 1' : true;
	}

	// Preview
	$: previewMockOptions = {
		resourceType: 'nft',
		rawResourceData: null,
		nfts: [
			{
				name: nftData.name || 'No Title',
				thumbnailUrl: nftData.thumbnailPreview || nftData.assetPreview,
				collectionData: { name: nftData.collectionName }
			}
		]
	} as CardOptions;
</script>

<!-- Back button -->
<button class="flex items-center mt-16 mb-8 space-x-2 text-sm font-semibold uppercase btn" on:click={goBack}>
	<Back />
	<div>Go Back</div>
</button>

<hr class="separator" />

<div class="flex mb-32">
	<!-- Left side -->
	<div class="flex-grow">
		<!-- Title -->
		<h1 class="mt-8 text-xl font-light uppercase">Step 1: Creating your drop</h1>

		<hr class="mt-8 separator" />

		<!-- File upload -->
		<div class="flex h-56 mt-8 mr-8">
			<div class="w-80">
				<div class="text-xs font-light uppercase text-color-black">Upload file</div>

				<div class="text-[#1D1D1DB2] mt-4 text-sm">File types:</div>
				<div class="mt-1 text-sm font-semibold text-color-black w-max">
					PNG, JPG, JPEG, GIF, WEBP, MP4, MP3 <br />
					Max 50 MB
				</div>
			</div>

			<div class="grid flex-grow place-items-stretch">
				<DragDropImage max_file_size={50_000_000} bind:blob={nftData.assetBlob} text={dragDropText} bind:previewSrc={nftData.assetPreview} acceptedFormats={acceptedVideos} />
			</div>
		</div>

		<!-- Thumbnail upload -->
		<div class="flex h-56 mt-8 mr-8">
			<div class="w-80">
				<div class="text-xs font-light uppercase text-color-black">Upload thumbnail</div>

				<div class="text-[#1D1D1DB2] mt-4 text-sm">For other marketplaces:</div>
				<div class="text-[#1D1D1DB2] mt-4 text-sm">File types:</div>
				<div class="mt-1 text-sm font-semibold text-color-black w-max">
					PNG, JPG, JPEG, GIF, WEBP <br />
					Max 3MB
				</div>
			</div>

			<div class="grid flex-grow place-items-stretch">
				<DragDropImage max_file_size={3_000_000} bind:blob={nftData.thumbnailBlob} text={dragDropText} bind:previewSrc={nftData.thumbnailPreview} acceptedFormats={acceptedImages} />
			</div>
		</div>

		<hr class="mt-12 separator" />

		<!-- NFT details -->
		<div class="flex mt-8 space-x-32">
			<div class="w-1/2">
				<div class="uppercase text-[#1D1D1DB2]">Create name</div>
				<input type="text" class="w-full mt-2 font-semibold input" bind:value={nftData.name} />

				<div class="uppercase text-[#1D1D1DB2] mt-8">NFT Quantity</div>
				<input type="number" class="w-full mt-2 font-semibold input input-hide-controls" step={1} bind:value={nftData.quantity} min={1} />

				<div class="uppercase text-[#1D1D1DB2] mt-8">Collection</div>
				{#if isLoadingCollections}
					<div class="flex items-center h-12 mt-2 border rounded-lg">
						<div class="relative w-12 h-full">
							<ButtonSpinner secondary class="w-4 h-4 ml-4" />
						</div>
						<div class="text-sm font-medium">Loading...</div>
					</div>
				{:else}
					<Dropdown
						selected={selectedCollectionRow}
						on:select={handleCollectionSelection}
						dispatchOnMount={false}
						options={[...$availableCollections, { label: 'Create new collection', value: 'collections/new/edit?to=create' }]}
						class="mt-2"
						btnClass="font-semibold"
					/>
				{/if}
			</div>

			<div class="w-1/2">
				<div class="uppercase text-[#1D1D1DB2]">Description</div>
				<TextArea outline containerClass="mt-2 mr-8" maxChars={200} placeholder="Enter description..." bind:value={nftData.description} />
			</div>
		</div>

		<hr class="mt-12 separator" />

		<FormErrorList validity={$formValidity} />

		<!-- Mint button -->
		<div class="w-full pr-8">
			<button class="w-full mt-8 font-semibold uppercase btn btn-gradient btn-rounded w- h-14" on:click={mintAndContinue} disabled={!inputValid}>Mint</button>
		</div>
	</div>

	<!-- Right side -->
	<div class="p-8 border-0 border-l separator w-80">
		<div class="mb-4 text-xl uppercase">Preview</div>
		<NftCard options={previewMockOptions} hideLikes />
	</div>
</div>
