<script>
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import TextArea from '$lib/components/TextArea.svelte';

	const dragDropText = 'Drag and drop an image <br> here, or click to browse';

	let nftName = '';
	let nftCollection = 'No collection';
	let nftDescription = '';
	let nftImagePreview = '';

	function mintAndContinue() {
		goto($page.path + '/list');
	}
</script>

<hr class="separator" />

<div class="flex mb-32">
	<!-- Left side -->
	<div class="flex-grow">
		<!-- Title -->
		<h1 class="text-xl uppercase mt-8">
			<span class="font-light italic">Step 3: Creating drop</span>
			|
			<span class="gradient-text font-bold italic pr-1">{$page.params.quantity}</span>
			|
			<span class="gradient-text font-bold italic pr-1">{$page.params.dropType}</span>
		</h1>

		<hr class="separator mt-8" />

		<!-- File upload -->
		<div class="mt-8 flex h-56 mr-8">
			<div class="w-80">
				<div class="uppercase italic font-light text-color-black">Upload file</div>

				<div class="text-[#1D1D1DB2] mt-4">File types:</div>
				<div class="text-color-black font-semibold mt-1">
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
				<div class="uppercase italic font-light text-color-black">Upload thumbnail</div>

				<div class="text-[#1D1D1DB2] mt-4">For other marketplaces:</div>
				<div class="text-[#1D1D1DB2] mt-4">File types:</div>
				<div class="text-color-black font-semibold mt-1 w-max">PNG, GIF</div>
			</div>

			<div class="flex-grow grid place-items-stretch">
				<DragDropImage text={dragDropText} />
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
				/>
			</div>
		</div>

		<hr class="separator mt-12" />

		<!-- Mint button -->
		<div class="pr-8 w-full">
			<button
				class="btn btn-gradient btn-rounded w- uppercase font-semibold mt-8 h-14 w-full"
				on:click={mintAndContinue}
			>
				Mint & Continue to Listing
			</button>
		</div>
	</div>

	<!-- Right side -->
	<div class="separator border-0 border-l p-8 w-80">
		<div class="uppercase italic text-xl mb-4">Preview</div>
		<NftCard name={nftName || 'N/A'} collectionName={nftCollection} imageUrl={nftImagePreview} />
	</div>
</div>
