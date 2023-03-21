<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { acceptedImages, acceptedVideos } from '$constants';
	import Back from '$icons/back_.svelte';
	import type { NftDraft } from '$interfaces/nft/nftDraft';
	import type { CardOptions } from '$interfaces/ui';
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import FormErrorList from '$lib/components/FormErrorList.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import NftMintProgressPopup from '$lib/components/popups/NftMintProgressPopup.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { nftDraft } from '$stores/create';
	import { refreshProfileData } from '$stores/user';
	import { connectionDetails, currentUserAddress } from '$stores/wallet';
	import { adaptCollectionToMintingDropdown } from '$utils/adapters/adaptCollectionToMintingDropdown';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { newBundleData, type NewBundleData } from '$utils/create';
	import { createNFTOnAPI, createNFTOnChain } from '$utils/create/createNFT';
	import { getContract } from '$utils/misc/getContract';
	import { goBack } from '$utils/navigation';
	import { setPopup, updatePopupProps } from '$utils/popup';
	import { notifyError } from '$utils/toast';
	import { writable } from 'svelte/store';

	const dragDropText =
		'Drag and drop an image <br> or <span class="text-gradient">click to browse</span>';
	const generalCollection = writable<{
		label: string;
		value: string;
		iconUrl: string;
		collectionAddress: string;
	}>(null);

	let dumpDraft = false;

	// for displaying in the collection dropdown
	let selectedCollectionRow: ReturnType<typeof adaptCollectionToMintingDropdown>;

	let nftData: Partial<NftDraft> = {
		name: '' || $nftDraft?.name,
		quantity: 1 || $nftDraft?.quantity,
		collectionAddress: $nftDraft?.collectionAddress,
		description: $nftDraft?.description,
		assetPreview: $nftDraft?.assetPreview,
		thumbnailPreview: $nftDraft?.thumbnailPreview,
		thumbnailBlob: $nftDraft?.thumbnailBlob,
		assetBlob: $nftDraft?.assetBlob,
	};

	const formValidity = writable<Partial<{ [K in keyof NftDraft]: any }>>({});

	const availableCollections = writable<
		{ label: string; value: string; iconUrl: string; collectionAddress: string }[]
	>([]);

	beforeNavigate(() => {
		dumpDraft ? nftDraft.set(null) : nftDraft.set(nftData);
	});

	let isLoadingCollections = true;

	async function prepData() {
		if (!$currentUserAddress) return;

		isLoadingCollections = true;

		await refreshProfileData();

		// Fetch general collection
		let genColl = (
			await apiSearchCollections({ collectionAddress: getContract('storage', true).address })
		).collections;
		genColl = genColl.map(adaptCollectionToMintingDropdown);
		generalCollection.set(genColl[0]);

		let collections: Collection[] = [];
		let page = 1;

		while (true) {
			const beforeLength = collections.length;

			const collectionsResponse = await apiSearchCollections({
				creator: $currentUserAddress,
				page,
			}).catch(() => ({ collections: [] }));
			collections.push(...collectionsResponse.collections);

			if (beforeLength === collections.length) break;
			page++;
		}

		const available = collections.filter((c) => c.slug).map(adaptCollectionToMintingDropdown);

		if ($generalCollection) {
			// Insert general collection if available and set it as selected
			available.unshift($generalCollection);
		}

		$availableCollections = available;

		// Make sure to visually select the selected collection
		let collectionToSelect = null;

		if ($nftDraft?.collectionAddress) {
			// User could have previously selected a collection which is now saved in a draft
			collectionToSelect = available.find(
				(i) => i.collectionAddress === $nftDraft.collectionAddress,
			);
		} else if (available.length) {
			// If no collection is saved in draft, select the first available collection
			collectionToSelect = available[0];
		}

		if (collectionToSelect) {
			handleCollectionSelection({ detail: collectionToSelect });
		}

		isLoadingCollections = false;
	}

	$: $currentUserAddress && $connectionDetails && prepData();

	async function mintAndContinue() {
		newBundleData.set({} as NewBundleData);
		const progress = writable(0);
		const popupHandler = setPopup(NftMintProgressPopup, {
			props: { progress },
			closeByOutsideClick: false,
		});

		// Create NFT on the server
		const createNftRes = await createNFTOnAPI({
			description: nftData.description,
			amount: nftData.quantity,
			name: nftData.name,
			creator: $currentUserAddress,
			thumbnail: nftData.thumbnailBlob,
			asset: nftData.assetBlob,
			collectionAddress: selectedCollectionRow.collectionAddress,
		});

		if (!createNftRes) {
			popupHandler.close();
			return;
		}

		updatePopupProps(popupHandler.id, { progress, id: createNftRes._id });

		progress.set(50);

		// create NFT on chain
		try {
			await createNFTOnChain({
				id: createNftRes.nftId.toString(),
				amount: nftData.quantity.toString(),
				collectionAddress: selectedCollectionRow.collectionAddress,
				uri: createNftRes.metadata.external_url,
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

	const handleCollectionSelection = (event: {
		detail: ReturnType<typeof adaptCollectionToMintingDropdown>;
	}) => {
		if (event.detail?.label === 'Create new collection') {
			goto(event.detail?.value);
		} else if ($availableCollections.length < 1) {
			// Skip this function during collection loading
			return;
		} else {
			selectedCollectionRow = event.detail;
			nftData.collectionAddress = selectedCollectionRow.collectionAddress;
		}
	};

	$: quantityValid = nftData.quantity > 0;
	$: inputValid =
		nftData.name &&
		nftData.name.trim() &&
		nftData.name.length <= 25 &&
		selectedCollectionRow &&
		nftData.assetPreview &&
		nftData.thumbnailPreview &&
		quantityValid;

	$: if (nftData) {
		if (!nftData.name) $formValidity.name = 'Name is Required';
		else if (!nftData.name.trim())
			$formValidity.name = 'Name must have at least one non-whitespace character';
		else if (nftData.name.length > 25)
			$formValidity.name = 'Name Cannot be more than 25 characters';
		else $formValidity.name = true;

		// Always makesure item is integer
		if (nftData.quantity) {
			nftData.quantity = parseInt(nftData.quantity.toString());
		}
		$formValidity.quantity =
			!!nftData.quantity && nftData.quantity > 0
				? true
				: !nftData.quantity
				? 'NFT quantity must be a minimum of 1'
				: true;
	}

	// Preview
	$: previewMockOptions = {
		resourceType: 'nft',
		rawResourceData: null,
		nfts: [
			{
				name: nftData.name || 'No Title',
				thumbnailUrl: nftData.thumbnailPreview || nftData.assetPreview || '',
				collectionData: { name: selectedCollectionRow?.label },
			},
		],
	} as CardOptions;
</script>

<!-- Back button -->
<button
	class="flex items-center my-8 space-x-2 text-sm font-semibold btn text-white"
	on:click={goBack}
>
	<Back />
	<div>Go Back</div>
</button>

<div class="flex mb-32 text-white border-t border-white">
	<!-- Left side -->
	<div class="flex-grow">
		<!-- Title -->
		<h1 class="mt-8 text-xl font-light uppercase">Step 1: Creating your drop</h1>

		<div class="grid grid-cols-2 mt-8 gap-16 pr-16">
			<!-- File upload -->
			<div>Upload file*</div>
			<div>
				<DragDropImage
					class="h-56"
					max_file_size={50_000_000}
					bind:blob={nftData.assetBlob}
					text={dragDropText}
					bind:previewSrc={nftData.assetPreview}
					acceptedFormats={acceptedVideos}
				>
					<div slot="lower_text" class="text-center">
						PNG, JPEG, JPG, GIF, WEBP, WEBM, MP4 | <span class="text-gradient">MAX 50MB</span>
					</div>

					<div slot="placeholder" class="text-center">
						Drag and drop an image <br />
						or
						<span class="text-gradient">click to browse</span>
					</div>
				</DragDropImage>
			</div>

			<div>Upload Thumbnail (Optional)</div>
			<!-- Thumbnail upload -->
			<div>
				<DragDropImage
					class="h-56"
					max_file_size={10_000_000}
					bind:blob={nftData.thumbnailBlob}
					text={dragDropText}
					bind:previewSrc={nftData.thumbnailPreview}
					acceptedFormats={acceptedImages}
				>
					<div slot="lower_text">
						PNG, JPEG, JPG, GIF, WEBP | <span class="text-gradient">MAX 10MB</span>
					</div>

					<div slot="placeholder">
						Drag and drop an image <br />
						or
						<span class="text-gradient">click to browse</span>
					</div>
				</DragDropImage>
			</div>
		</div>

		<!-- NFT details -->
		<div class="grid  grid-cols-2 mt-8 border-b border-white pb-12">
			<div class="mr-32">
				<div>Create name</div>
				<input
					type="text"
					placeholder="Your NFT name"
					class="w-full mt-2 font-semibold input"
					bind:value={nftData.name}
				/>

				<div class="mt-8">NFT Quantity</div>
				<input
					type="number"
					class="w-full mt-2 font-semibold input input-hide-controls"
					step={1}
					bind:value={nftData.quantity}
					min={1}
				/>
			</div>

			<div class="mr-8">
				<div>Description</div>
				<TextArea
					containerClass="mt-2"
					maxChars={200}
					placeholder="Enter description..."
					bind:value={nftData.description}
				/>

				<!-- Collection dropdown -->
				{#if isLoadingCollections}
					<div class="flex items-center h-12 mt-2 border">
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
						options={[
							...$availableCollections,
							{ label: 'Create new collection', value: 'collections/new/edit?to=create' },
						]}
						class="mt-2 h-12"
						btnClass="font-semibold"
					/>
				{/if}
			</div>
		</div>

		<FormErrorList validity={$formValidity} />

		<!-- Mint button -->
		<div class="w-full pr-8 mt-8">
			<PrimaryButton on:click={mintAndContinue} disabled={!inputValid}>MINT</PrimaryButton>
		</div>
	</div>

	<!-- Right side -->
	<div class="pl-8 pt-8 border-0 border-l border-white separator w-96">
		<div class="mb-4 text-xl uppercase">Preview</div>
		<div>
			<NftCard options={previewMockOptions} hideLikes />
		</div>
	</div>
</div>
