<script>
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import { newDropProperties } from '$stores/create';
	import { setPopup } from '$utils/popup';
	import ContinueListingPopup from '$lib/components/create/ContinueListingPopup.svelte';
	import { createDropOnAPI, createDropOnChain } from '$utils/create/createDrop';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import { generateDropCreationSignMessage } from '$utils/signature';
	import { createNFTOnAPI, createNFTOnChain } from '$utils/create/createNFT';
	import { getAuthToken } from '$utils/api';

	const dragDropText = 'Drag and drop an image <br> here, or click to browse';

	let nftName = '';
	let nftCollection = 'No collection';
	let nftDescription = '';
	let nftImagePreview = '';
	let nftThumbnailPreview = '';

	async function mintAndContinue() {
		// Mint function here

		// create message to sign
		let dropId = '';
		const signature = getAuthToken($currentUserAddress);

		console.log(signature);

		// create drop
		const dropCreationApiResponse = await createDropOnAPI({
			contractId: 0,
			title: nftName,
			artist: $currentUserAddress,
			creator: $currentUserAddress,
			description: nftDescription,
			signature
		});

		console.log(dropCreationApiResponse);

		// create drop on chain
		// await createDropOnChain(dropId);

		// create nft
		const nftCreationApiResponse = await createNFTOnAPI({
			dropId,
			contractId: 0,
			amount: '1',
			name: nftName,
			generation: nftCollection,
			categories: '', // empty, the frontend does not have this
			tag: '', // empty frontend does not have this
			artist: $currentUserAddress,
			creator: $currentUserAddress,
			signature
		});

		console.log(nftCreationApiResponse);

		// mint nft on chain
		// await createNFTOnChain({ dropId, id: '0', amount: '1' });

		setPopup(ContinueListingPopup, {
			props: { relHref: 'sale', title: 'Sale', imgUrl: '/img/create/drop-type-sale.svg' }
		});
	}

	$: inputValid = nftName && nftCollection && nftImagePreview && nftThumbnailPreview;
</script>

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
				<DragDropImage text={dragDropText} bind:previewSrc={nftImagePreview} />
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
				<DragDropImage text={dragDropText} bind:previewSrc={nftThumbnailPreview} />
			</div>
		</div>

		<hr class="separator mt-12" />

		<!-- NFT details -->
		<div class="flex space-x-32 mt-8">
			<div class="w-1/2">
				<div class="uppercase italic text-[#1D1D1DB2]">Create name</div>
				<input type="text" class="input w-full mt-2 font-semibold" bind:value={nftName} />

				<div class="uppercase italic text-[#1D1D1DB2] mt-8">Collection</div>
				<Dropdown options={[{ label: 'No collections.' }]} class="mt-2" btnClass="font-semibold" />
			</div>

			<div class="w-1/2">
				<div class="uppercase italic text-[#1D1D1DB2]">Description</div>
				<TextArea
					outline
					containerClass="mt-2 mr-8"
					maxChars={200}
					placeholder="Enter description..."
					bind:value={nftDescription}
				/>
			</div>
		</div>

		<hr class="separator mt-12" />

		<!-- Mint button -->
		<div class="pr-8 w-full">
			<button
				class="btn btn-gradient btn-rounded w- uppercase font-semibold mt-8 h-14 w-full"
				on:click={mintAndContinue}
				disabled={!inputValid}
			>
				Mint
			</button>
		</div>
	</div>

	<!-- Right side -->
	<div class="separator border-0 border-l p-8 w-80">
		<div class="uppercase italic text-xl mb-4">Preview</div>
		<NftCard name={nftName || 'N/A'} collectionName={nftCollection} imageUrl={nftImagePreview} />
	</div>
</div>
