<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';

	export let options: CardPopupOptions;

	// Never show the back button on this tab
	export const showBackButton = false;

	$: properties = [
		{ name: 'Creator', value: options.creator },
		{ name: 'Collection name', value: options.metadata?.name },
		{ name: 'Edition', value: options.metadata?.edition },
		{ name: 'Description', value: options.metadata?.description }
	];

	$: technicalProperties = [
		{ name: 'Contract Add', value: options.tokenAddress },
		{ name: 'Token Standard', value: options.contractType },
		{ name: 'Creator Fee', value: '10%' },
		{ name: 'Token ID', value: options.id },
		{ name: 'Blockchain', value: 'ETH' }
	];
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
	{#if options.metadata?.attributes}
		<div class="grid grid-cols-3 gap-4">
			{#each options.metadata.attributes as attr}
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

<style>
	.property-name {
		@apply text-transparent font-semibold text-lg;
		background: linear-gradient(90deg, #8e77f7 -32.32%, rgba(142, 119, 247, 0.05) 113.47%), #67d4f8;
		background-clip: text;
	}

	.property-value {
		@apply mb-4 font-medium;
	}
</style>
