<script lang="ts">
	import Back from '$icons/back_.svelte';
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import NftMintProgressPopup from '$lib/components/popups/NftMintProgressPopup.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import { newDropProperties } from '$stores/create';
	import { profileData } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { fetchProfileData } from '$utils/api/profile';
	import { NewBundleData, newBundleData } from '$utils/create';
	import { createBundle } from '$utils/create/createBundle';
	import { createDropOnChain } from '$utils/create/createDrop';
	import { batchMintNft, createNFTOnAPI } from '$utils/create/createNFT';
	import { goBack } from '$utils/navigation';
	import { setPopup } from '$utils/popup';
	import { notifyError } from '$utils/toast';
	import { random } from 'lodash-es';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const dragDropText = 'Drag and drop an image <br> here, or click to browse';

	let nftName = '';
	let nftQuantity: number;
	let nftCollection = 'No collection';
	let nftDescription = '';
	let nftAssetPreview = '';
	let nftThumbnailPreview = '';
	let fileBlob;
	let animationBlob;

	onMount(async () => {
		profileData.set(await fetchProfileData($currentUserAddress));
	});

	async function mintAndContinue() {
		// Keep for skipping mint
		// goto('/create/choose-listing-format');
		// return;

		// Notes:
		// Bundle is a former drop

		newBundleData.set({} as NewBundleData);

		const progress = writable(0);
		const popupHandler = setPopup(NftMintProgressPopup, { props: { progress }, closeByOutsideClick: false });

		// Create NFT on the server
		const nftId = await random(0, 999999999);
		console.info('[Create] Using new NFT ID:', nftId);

		const createNftRes = await createNFTOnAPI({
			contractId: nftId,
			amount: nftQuantity,
			name: nftName,
			artist: $profileData?._id,
			creator: $currentUserAddress,
			image: fileBlob,
			animation: animationBlob
		});

		if (!createNftRes) {
			popupHandler.close();
			return;
		}

		progress.set(33);

		// Create NFT bundle on the server
		const bundleId = await random(0, 999999999);
		console.info('[Create] Using new Bundle ID:', bundleId);

		const createdBundleRes = await createBundle({
			contractId: bundleId,
			creator: $currentUserAddress,
			description: nftDescription,
			title: nftName,
			nftIds: [nftId],
			nftAmounts: [nftQuantity],
			image: fileBlob,
			animation: animationBlob
		});

		if (!createdBundleRes) {
			popupHandler.close();
			return;
		}

		// Create bundle on chain
		const chainBundleSuccess = await createDropOnChain(bundleId);

		if (chainBundleSuccess) {
			console.info('[Create] Bundle created on chain.');
		} else {
			popupHandler.close();
			notifyError('Failed to create bundle on chain.');
			console.error('[Create] Failed to create bundle on chain.');
			return;
		}

		progress.set(66);

		// Create NFT on chain
		const nftBundleSuccess = await batchMintNft({ dropId: bundleId, nftIds: [nftId], nftAmounts: [nftQuantity] });

		if (nftBundleSuccess) {
			console.info('[Create] NFT created on chain.');
		} else {
			popupHandler.close();
			notifyError('Failed to create NFT on chain.');
			console.error('[Create] Failed to create NFT on chain.');
			return;
		}

		newBundleData.update((data) => {
			return { ...data, bundleId };
		});

		progress.set(100);
	}

	$: nftQuantityValid = nftQuantity > 0;
	$: inputValid = nftName && nftCollection && nftAssetPreview && nftThumbnailPreview && nftQuantityValid;
</script>

<!-- Back button -->
<button class="btn flex items-center space-x-2 uppercase font-semibold mt-16 mb-8 text-sm" on:click={goBack}>
	<Back />
	<div>Go Back</div>
</button>

<hr class="separator" />

<div class="flex mb-32">
	<!-- Left side -->
	<div class="flex-grow">
		<!-- Title -->
		<h1 class="text-xl uppercase mt-8">
			<span class="font-light italic">Step 2: Creating drop</span>
			|
			<span class="gradient-text font-bold italic pr-1">{$newDropProperties.quantity}</span>
		</h1>

		<hr class="separator mt-8" />

		<!-- File upload -->
		<div class="mt-8 flex h-56 mr-8">
			<div class="w-80">
				<div class="uppercase italic font-light text-color-black text-xs">Upload file</div>

				<div class="text-[#1D1D1DB2] mt-4 text-sm">File types:</div>
				<div class="text-color-black font-semibold mt-1 text-sm">
					PNG, GIF, WEBP, MP4, MP3 <br />
					Max 50 MB
				</div>
			</div>

			<div class="flex-grow grid place-items-stretch">
				<DragDropImage bind:blob={animationBlob} text={dragDropText} bind:previewSrc={nftAssetPreview} acceptedType="video" />
			</div>
		</div>

		<!-- Thumbnail upload -->
		<div class="mt-8 flex h-56 mr-8">
			<div class="w-80">
				<div class="uppercase italic font-light text-color-black text-xs">Upload thumbnail</div>

				<div class="text-[#1D1D1DB2] mt-4 text-sm">For other marketplaces:</div>
				<div class="text-[#1D1D1DB2] mt-4 text-sm">File types:</div>
				<div class="text-color-black font-semibold mt-1 w-max">PNG, GIF</div>
			</div>

			<div class="flex-grow grid place-items-stretch">
				<DragDropImage bind:blob={fileBlob} text={dragDropText} bind:previewSrc={nftThumbnailPreview} />
			</div>
		</div>

		<hr class="separator mt-12" />

		<!-- NFT details -->
		<div class="flex space-x-32 mt-8">
			<div class="w-1/2">
				<div class="uppercase italic text-[#1D1D1DB2]">Create name</div>
				<input type="text" class="input w-full mt-2 font-semibold" bind:value={nftName} />

				<div class="uppercase italic text-[#1D1D1DB2] mt-8">NFT Quantity</div>
				<input type="number" class="input w-full mt-2 font-semibold input-hide-controls" bind:value={nftQuantity} min="1" />

				<div class="uppercase italic text-[#1D1D1DB2] mt-8">Collection</div>
				<Dropdown options={[{ label: 'No collections.' }]} class="mt-2" btnClass="font-semibold" />
			</div>

			<div class="w-1/2">
				<div class="uppercase italic text-[#1D1D1DB2]">Description</div>
				<TextArea outline containerClass="mt-2 mr-8" maxChars={200} placeholder="Enter description..." bind:value={nftDescription} />
			</div>
		</div>

		<hr class="separator mt-12" />

		<!-- Mint button -->
		<div class="pr-8 w-full">
			<button class="btn btn-gradient btn-rounded w- uppercase font-semibold mt-8 h-14 w-full" on:click={mintAndContinue} disabled={!inputValid}>Mint</button>
		</div>
	</div>

	<!-- Right side -->
	<div class="separator border-0 border-l p-8 w-80">
		<div class="uppercase italic text-xl mb-4">Preview</div>
		<NftCard name={nftName || 'N/A'} collectionName={nftCollection} imageUrl={nftAssetPreview} />
	</div>
</div>
