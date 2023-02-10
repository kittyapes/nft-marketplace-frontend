<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import { getMarketFee } from '$utils/contracts/listing';
	import { getContractData } from '$utils/misc/getContract';
	import { totalColRoyalties } from '$utils/misc/royalties';
	import getUserNftBalance from '$utils/nfts/getUserNftBalance';
	import { closePopup } from '$utils/popup';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let options: CardOptions;

	let marketFee = 0;
	let balance = null;
	let supply = null;

	$: ownedOrListedNfts = options.resourceType === 'listing' ? options.rawListingData.nfts[0].amount : balance;

	// The Hinata General collection should always have a 1.5 % royalties,
	// you know we cannot rely on the backend :)
	// prettier-ignore
	$: royaltyPercentage = 
		(options.nfts[0].contractAddress === getContractData('storage').address && "1.5 % Beneficiary") ||
		totalColRoyalties(options) + ' % Royalty'

	// It is possible to pass data of multiple NFTs into the popup to support
	// the bundle section
	$: singleNft = options.nfts?.[0];

	$: technicalProperties = [
		{ name: 'Contract Address', value: singleNft.contractAddress },
		{ name: 'Token Standard', value: singleNft.contractType },
		{
			name: 'Fees and Royalties',
			value: marketFee + ' % Fee | ' + royaltyPercentage,
		},
		{ name: 'Token ID', value: singleNft.onChainId },
		{ name: 'Blockchain', value: options.listingData?.paymentTokenTicker || options.rawResourceData.chain },
		{
			name: options.resourceType === 'listing' ? 'NFTs in Listing' : 'You Own',
			value: balance !== null ? `${ownedOrListedNfts} of ${supply}` : null,
		},
	];

	$: creatorAddress = singleNft.creator || options.rawResourceData.metadata?.creator?.address;

	onMount(async () => {
		// When its not a listing
		marketFee = await getMarketFee();
		const res = await getUserNftBalance(singleNft.contractAddress, singleNft.onChainId);

		supply = res.supply;
		balance = options.resourceType === 'listing' ? options.rawListingData.nfts[0].amount ?? 0 : res.balance;
	});

	function parseAttributes(attributes) {
		// In case attributes is not a list, but an object, we need to convert it to a list
		if (attributes.length === undefined) {
			attributes = Object.entries(attributes).map(([key, value]) => ({
				trait_type: key,
				value: value,
			}));
		}

		return attributes;
	}
</script>

<div class="flex-grow h-full pr-4 overflow-y-auto blue-scrollbar text-white">
	<!-- Properties -->
	<div class="gap-16 grid grid-cols-4">
		<div class="overflow-hidden">
			<div class="--property-name text-gradient">Creator</div>
			<div class="--property-value">
				{#if creatorAddress}
					<a href={'/profile/' + creatorAddress} on:click={() => closePopup()}>{creatorAddress || 'N/A'}</a>
				{:else}
					{'N/A'}
				{/if}
			</div>
		</div>

		<div class="overflow-hidden">
			<div class="--property-name text-gradient">Owner</div>
			<div class="--property-value">Unknown</div>
		</div>

		<div class="overflow-hidden col-span-2">
			<div class="--property-name text-gradient">Collection Name</div>
			<div class="--property-value">
				<a href={'/collections/' + singleNft.collectionData.slug} on:click={() => closePopup()}>
					{singleNft.collectionData?.name}
				</a>
			</div>
		</div>
	</div>

	<div class="text-gradient text-lg font-medium mt-16">Description</div>
	<div>{singleNft.metadata.description}</div>

	<!-- NFT attributes -->
	{#if singleNft.metadata?.attributes}
		<div class="grid grid-cols-2 gap-4 mt-16">
			{#each parseAttributes(singleNft.metadata.attributes) as attr}
				<div>
					<div class="text-lg">{attr.trait_type}</div>
					<div class="py-2 mt-2 text-center text-white uppercase bg-black attr-block-bg">{attr.value || 'N/A'}</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Technical properties -->
	<div class="grid gap-16 mt-16 grid-cols-2">
		{#each technicalProperties as prop}
			<div class="overflow-hidden">
				<div class="text-lg text-gradient font-medium">{prop.name}</div>

				<div class="relative property-value">
					{prop.value || 'N/A'}
					{#if prop.value === null}
						<div class="absolute top-0 w-24 h-6 mt-1 bg-gray-700 rounded" out:fade|local />
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.--property-name {
		@apply text-lg font-medium whitespace-nowrap overflow-hidden;
	}

	.--property-value {
		@apply whitespace-nowrap truncate overflow-hidden;
	}

	.attr-block-bg {
		background: linear-gradient(226.41deg, rgba(103, 212, 248, 0.05) 40.04%, rgba(142, 119, 247, 0.05) 92.94%),
			linear-gradient(190.19deg, rgba(103, 212, 248, 0.05) 2.45%, rgba(142, 119, 247, 0.05) 102.25%), linear-gradient(188.04deg, rgba(103, 212, 248, 0.05) 5.57%, rgba(142, 119, 247, 0.05) 92.06%),
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%);
		box-shadow: inset -2px 2px 4px #88eaff, inset 2px -1px 5px #a794ff;
	}
</style>
