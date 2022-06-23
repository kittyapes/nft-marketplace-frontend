<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';

	export let options: CardPopupOptions;

	// Never show the back button on this tab
	export const showBackButton = false;

	// It is possible to pass data of multiple NFTs into the popup to support
	// the bundle section
	$: nftData = options.nftData?.[0];
	$: properties = [
		{ name: 'Creator', value: nftData.creator },
		{ name: 'Collection name', value: options.collectionData?.name },
		{ name: 'Edition', value: nftData.metadata?.edition },
		{ name: 'Description', value: nftData.metadata?.description }
	];

	$: technicalProperties = [
		{ name: 'Contract Add', value: nftData.contractAddress },
		{ name: 'Token Standard', value: nftData.contractType },
		{ name: 'Creator Fee', value: '10%' },
		{ name: 'Token ID', value: nftData.tokenId },
		{ name: 'Blockchain', value: 'ETH' }
	];

	function parseAttributes(attributes) {
		// In case attributes is not a list, but an object, we need to convert it to a list
		if (attributes.length === undefined) {
			attributes = Object.entries(attributes).map(([key, value]) => ({
				trait_type: key,
				value: value
			}));
		}

		return attributes;
	}
</script>

<div class="flex-grow h-full pb-8 pr-4 mb-8 overflow-y-auto">
	<!-- Properties -->
	<div class="mt-4">
		{#each properties as prop}
			<div class="property-name">{prop.name}</div>
			<div class="property-value">{prop.value || 'N/A'}</div>
		{/each}
	</div>

	<!-- NFT attributes -->
	{#if nftData.metadata?.attributes}
		<div class="grid grid-cols-3 gap-4">
			{#each parseAttributes(nftData.metadata.attributes) as attr}
				<div>
					<div class="text-xs font-semibold text-center uppercase">{attr.trait_type}</div>
					<div class="py-2 mt-1 text-xs text-center text-white uppercase bg-black rounded-full">{attr.value || 'N/A'}</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Technical properties -->
	<div class="grid grid-cols-3 gap-4 mt-8">
		{#each technicalProperties as prop}
			<div class="overflow-hidden">
				<div class="property-name">{prop.name}</div>
				<div class="property-value">{prop.value || 'N/A'}</div>
			</div>
		{/each}
	</div>
</div>

<style type="postcss">
	.property-name {
		@apply text-transparent font-semibold text-lg;
		background: linear-gradient(90deg, #8e77f7 -32.32%, rgba(142, 119, 247, 0.05) 113.47%), #67d4f8;
		background-clip: text;
	}

	.property-value {
		@apply mb-4 font-medium;
	}
</style>
