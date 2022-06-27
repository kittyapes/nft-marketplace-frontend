<script lang="ts">
	import { HinataMarketplaceContractAddress, HinataMarketplaceStorageContractAddress, WethContractAddress } from '$constants/contractAddresses';
	import Info from '$icons/info.v2.svelte';
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import TokenDropdown from '$lib/components/TokenDropdown.svelte';
	import type { ListingType } from '$utils/api/listing';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { getTokenAddress } from '$utils/misc/getTokenAddress';
	import { notifyError } from '$utils/toast';
	import dayjs from 'dayjs';
	import { BigNumber } from 'ethers';
	import { parseEther } from 'ethers/lib/utils.js';
	import { createEventDispatcher } from 'svelte';
	import ListingTypeSwitch from './ListingTypeSwitch.svelte';
	import Input from '$lib/components/v2/Input/Input.svelte';
	import { createListingFlow, type CreateListingFlowOptions } from '$utils/flows/createListingFlow';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { listingDurationOptions, listingTokens } from '$utils/contracts/listing';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;

	let selectedListingType: ListingType = 'auction';

	let price: any;
	let paymentTokenTicker: string;
	let duration: number;
	let startingPrice: any;
	let reservePrice: string;

	$: console.log(price, paymentTokenTicker, duration);

	// Validation
	let formValid = false;

	$: if (selectedListingType === 'sale') {
		formValid = price > 0;
	} else if (selectedListingType === 'auction') {
		// formValid = startingPrice > 0 && reservePriceValid;
		formValid = startingPrice > 0;
	}

	let isListing = false;

	async function completeListing() {
		isListing = true;

		const flowOptions: CreateListingFlowOptions = {
			title: options.nftData[0].metadata?.name,
			description: options.nftData[0].metadata?.description,
			duration,
			nfts: [{ nftId: options.nftData[0].tokenId, amount: BigNumber.from(1), collectionAddress: HinataMarketplaceStorageContractAddress }],
			paymentTokenAddress: getTokenAddress(paymentTokenTicker as any),
			paymentTokenTicker,
			quantity: BigNumber.from(1),
			startTime: dayjs().unix() + 10,
			listingType: selectedListingType,
			sale: {} as any,
			auction: {} as any
		};

		if (selectedListingType === 'sale') {
			flowOptions.sale.price = parseEther(price.toString());
		} else if (selectedListingType === 'auction') {
			flowOptions.auction.startingPrice = parseEther(startingPrice.toString());
			// flowOptions.auction.reservePrice = parseEther(reservePrice || '0');
		}

		const { err } = await createListingFlow(flowOptions);

		if (err) {
			console.error(err);
			notifyError(err.message);
		} else {
			dispatch('set-state', { name: 'success', props: { successDescription: 'Successfully listed.', showMarketplaceButton: false } });
		}

		isListing = false;
	}

	let reservePriceValid: boolean;
</script>

<div class="flex flex-col h-full pb-8 pr-6 overflow-y-auto">
	<!-- Listing Type -->
	<div class="mt-4 font-semibold">Listing Type</div>
	<div class="mt-2"><ListingTypeSwitch bind:selectedType={selectedListingType} /></div>

	{#if selectedListingType === 'sale'}
		<!-- Price -->
		<div class="mt-4 font-semibold">Price</div>
		<div class="mt-2">
			<TokenDropdown
				dropdownBg="white"
				dropdownColor="black"
				dropdownButtonBg="white"
				dropdownButtonColor="black"
				showLabel
				showArrow={false}
				tokens={listingTokens}
				buttonDisabled
				bind:value={price}
				on:select={(ev) => (paymentTokenTicker = ev.detail.label)}
			/>
		</div>

		<!-- Duration -->
		<div class="mt-4 mb-2 font-semibold">Duration</div>
		<Dropdown options={listingDurationOptions} on:select={(ev) => (duration = ev.detail.value)} borderOpacity={1} />

		<!-- Specific buyer -->
		<!-- Not in v1 -->
		{#if false}
			<div class="flex mt-4 space-x-2">
				<Toggle --width="3rem" onInsideLabel="" offInsideLabel="" />
				<div class="font-semibold">Reserve for specific buyer</div>
			</div>
		{/if}
	{:else if selectedListingType === 'auction'}
		<!-- Process -->
		{#if false}
			<div class="mt-4 mb-2 font-semibold">Process</div>
			<!-- This apparently shouldn't be a button -->
			<!-- <Button>Sell To Highest Bidder</Button> -->
		{/if}

		<!-- Starting price -->
		<div class="mt-4 font-semibold">Reserve Price</div>
		<div class="mt-2">
			<TokenDropdown
				dropdownBg="white"
				dropdownColor="black"
				dropdownButtonBg="white"
				dropdownButtonColor="black"
				showLabel
				showArrow={false}
				tokens={listingTokens}
				buttonDisabled
				bind:value={startingPrice}
				on:select={(ev) => (paymentTokenTicker = ev.detail.label)}
			/>
		</div>

		<!-- Duration -->
		<div class="mt-4 mb-2 font-semibold">Duration</div>
		<Dropdown options={listingDurationOptions} on:select={(ev) => (duration = ev.detail.value)} borderOpacity={1} />

		<!-- Reserve price -->
		{#if false}
			<div class="mt-4 mb-2 font-semibold">Reserve Price (optional)</div>
			<Input bind:value={reservePrice} placeholder="Amount" regex={/^(\d+)?$/} bind:valid={reservePriceValid} />
		{/if}
	{/if}

	<div class="flex-grow" />

	<!-- Fees -->
	<div class="mt-4 font-semibold">Fees</div>
	<div class="grid gap-2 mt-2 font-semibold" style:grid-template-columns="auto 6rem">
		<div>Creator Royalties:</div>
		<div class="flex justify-end space-x-3">
			<div class="">0.0%</div>
			<div class="w-6">
				<Info />
			</div>
		</div>

		<div class="gradient-text">Hinata Fees:</div>
		<div class="flex justify-end space-x-3">
			<div class="gradient-text">0%</div>
			<div class="w-6">
				<Info />
			</div>
		</div>
	</div>

	<PrimaryButton class="mt-4" disabled={!formValid || isListing} on:click={completeListing}>Complete Listing</PrimaryButton>
</div>
