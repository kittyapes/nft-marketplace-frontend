<script lang="ts">
	import { goto } from '$app/navigation';
	import type { CardOptions } from '$interfaces/ui';
	import { getMarketFee } from '$utils/contracts/listing';
	import { totalColRoyalties } from '$utils/misc/royalties';
	import getUserNftBalance from '$utils/nfts/getUserNftBalance';
	import { closePopup } from '$utils/popup';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let options: CardOptions;

	let marketFee = 0;
	let balance = null;
	let supply = null;

	$: ownedOrListedNfts = options.resourceType === 'listing' ? options?.nfts[0].quantity ?? 1 : balance;

	// Never show the back button on this tab
	export const showBackButton = false;

	// It is possible to pass data of multiple NFTs into the popup to support
	// the bundle section
	$: singleNft = options.nfts?.[0];
	$: properties = [
		{ name: 'Creator', value: singleNft.creator || options.rawResourceData.metadata?.creator?.address },
		{ name: 'Collection name', value: singleNft.collectionData?.name },
		{ name: 'Edition', value: singleNft.metadata?.edition },
		{ name: 'Description', value: singleNft.metadata?.description }
	];

	$: technicalProperties = [
		{ name: 'Contract Add', value: singleNft.contractAddress },
		{ name: 'Token Standard', value: singleNft.contractType },
		{
			name: 'Fees and Royalties',
			value: marketFee + ' % Fee | ' + (totalColRoyalties(options) ? `${totalColRoyalties(options) + ' % Royalty'}` : '- % Royalty')
		},
		{ name: 'Token ID', value: singleNft.onChainId },
		{ name: 'Blockchain', value: options.listingData?.paymentTokenTicker || options.rawResourceData.chain },
		{
			name: options.resourceType === 'listing' ? 'NFTs in Listing' : 'You Own',
			value: balance !== null ? `${ownedOrListedNfts} of ${supply}` : null
		}
	];

	onMount(async () => {
		// When its not a listing
		marketFee = await getMarketFee();
		const res = await getUserNftBalance(singleNft.contractAddress, singleNft.onChainId);

		balance = res.balance;
		supply = res.supply;
	});

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

<div class="flex-grow h-full pb-8 pr-4 mb-8 overflow-y-auto blue-scrollbar">
	<!-- Properties -->
	<div class="mt-4">
		{#each properties as prop}
			{#if prop.name === 'Collection name' && prop.value}
				<div
					on:click={() => {
						closePopup();
						goto('/collections/' + singleNft.collectionData.slug);
					}}
					class="overflow-hidden clickable"
				>
					<div class="property-name">{prop.name}</div>
					<div class="property-value">{prop.value || 'N/A'}</div>
				</div>
			{:else if prop.name === 'Creator' && prop.value}
				<div
					on:click={() => {
						closePopup();
						if (properties[0].value) goto('/profile/' + properties[0].value);
					}}
					class="overflow-hidden clickable"
				>
					<div class="property-name">{prop.name}</div>
					<div class="property-value">{prop.value || 'N/A'}</div>
				</div>
			{:else}
				<div class="property-name">{prop.name}</div>
				<div class="property-value">{prop.value || 'N/A'}</div>
			{/if}
		{/each}
	</div>

	<!-- NFT attributes -->
	{#if singleNft.metadata?.attributes}
		<div class="grid grid-cols-3 gap-4">
			{#each parseAttributes(singleNft.metadata.attributes) as attr}
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
			<div class="overflow-hidden {prop.name === 'Fees and Royalties' ? 'text-sm' : ''}">
				<div class="property-name">{prop.name}</div>

				<div class="relative property-value">
					{prop.value || 'N/A'}
					{#if prop.value === null}
						<div class="absolute top-0 w-24 h-6 mt-1 bg-gray-100 rounded" out:fade|local />
					{/if}
				</div>
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
