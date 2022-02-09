<script>
	import DragDropImage from '$lib/components/DragDropImage.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import TextArea from '$lib/components/TextArea.svelte';

	const dragDropText = 'Drag and drop an image <br> here, or click to browse';
</script>

<hr class="separator" />

<div class="flex">
	<!-- Left side -->
	<div class="flex-grow">
		<!-- Title -->
		<h1 class="text-xl uppercase italic mt-8">
			Step 1: Create <span class="gradient-text not-italic font-semibold">NFT</span>
		</h1>

		<hr class="separator mt-8" />

		<!-- File upload -->
		<div class="mt-8 flex h-56 mr-8">
			<div class="flex-grow">
				<div class="uppercase italic">Upload file</div>

				<div class="text-[#1D1D1DB2] mt-4">File types:</div>
				<div class="text-color-black font-semibold mt-1">
					PNG, GIF, WEBP, MP4, MP3 <br /> Max 50 MB
				</div>
			</div>

			<DragDropImage class="ml-24 max-w-screen-sm" text={dragDropText} />
		</div>

		<!-- Thumbnail upload -->
		<div class="mt-8 flex h-56 mr-8">
			<div class="flex-grow">
				<div class="uppercase italic">Upload thumbnail</div>

				<div class="text-[#1D1D1DB2] mt-4">For other marketplaces:</div>
				<div class="text-[#1D1D1DB2] mt-4">File types:</div>
				<div class="text-color-black font-semibold mt-1 w-max">PNG, GIF</div>
			</div>

			<DragDropImage class="ml-24 max-w-screen-sm" text={dragDropText} />
		</div>

		<hr class="separator mt-12" />

		<!-- NFT details -->
		<div class="flex space-x-32 mt-8">
			<div class="w-1/2">
				<div class="uppercase italic text-[#1D1D1DB2]">Create name</div>
				<input type="text" class="input w-full mt-2 font-semibold" />

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
				class="btn btn-gradient btn-rounded w- uppercase font-semibold mt-8 mb-32 h-14 w-full"
			>
				Mint & Continue to Listing
			</button>
		</div>
	</div>

	<!-- Right side -->
	<div class="separator border-0 border-l p-8">
		<div class="uppercase italic text-xl">Preview</div>
		<!-- TODO -->
		<!-- <NftCard /> -->
	</div>
</div>
