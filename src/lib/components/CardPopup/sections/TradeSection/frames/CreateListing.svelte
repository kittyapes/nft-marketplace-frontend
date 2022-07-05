<script lang="ts">
	import Info from '$icons/info.v2.svelte';
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import TokenDropdown from '$lib/components/TokenDropdown.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import type { ListingType } from '$utils/api/listing';
	import { listingDurationOptions, listingTokens } from '$utils/contracts/listing';
	import { createListingFlow, type CreateListingFlowOptions } from '$utils/flows/createListingFlow';
	import { getContractData } from '$utils/misc/getContract';
	import { notifyError } from '$utils/toast';
	import dayjs from 'dayjs';
	import { BigNumber } from 'ethers';
	import { parseUnits } from 'ethers/lib/utils.js';
	import { createEventDispatcher } from 'svelte';
	import ListingTypeSwitch from './ListingTypeSwitch.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;

	let selectedListingType: ListingType = 'auction';

	let price: any;
	let paymentTokenTicker: string;
	let duration: number;
	let startingPrice: string;
	let reservePrice: string;
	let quantity: string = '1';
	let maxQuantity = options.nftData[0]?.userNftBalance ?? 1;

	// Validation
	let formValid = false;

	$: if (selectedListingType === 'sale') {
		formValid = price > 0 || +quantity > maxQuantity;
	} else if (selectedListingType === 'auction') {
		try {
			formValid = (parseUnits(startingPrice, 18).gt(0) && parseUnits(reservePrice, 18).gt(0)) || +quantity > maxQuantity;
		} catch {
			formValid = false;
		}
	}

	let isListing = false;

	async function completeListing() {
		isListing = true;

		const flowOptions: CreateListingFlowOptions = {
			title: options.nftData[0].metadata?.name,
			description: options.nftData[0].metadata?.description,
			duration,
			nfts: [{ nftId: options.nftData[0].tokenId, amount: BigNumber.from(quantity ?? 1), collectionAddress: getContractData('storage').address }],
			paymentTokenAddress: getContractData('weth').address,
			paymentTokenTicker,
			quantity: BigNumber.from(1),
			startTime: dayjs().unix() + 10,
			listingType: selectedListingType,
			sale: {} as any,
			auction: {} as any
		};

		if (selectedListingType === 'sale') {
			flowOptions.sale.price = price;
		} else if (selectedListingType === 'auction') {
			flowOptions.auction.startingPrice = startingPrice;
			flowOptions.auction.reservePrice = reservePrice;
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

		<div class="flex items-center justify-between gap-x-1">
			{#if maxQuantity > 1}
				<div class="flex flex-col flex-grow">
					<div class="mt-4 font-semibold">Quantity</div>
					<div class="mt-2">
						<input type="number" class="w-full h-12 input input-hide-controls border border-black" bind:value={quantity} max={maxQuantity} min={1} />
					</div>
				</div>
			{/if}

			<!-- Duration -->
			<div class="flex flex-col flex-grow">
				<div class="mt-4 mb-2 font-semibold">Duration</div>
				<Dropdown options={listingDurationOptions} on:select={(ev) => (duration = ev.detail.value)} borderOpacity={1} />
			</div>
		</div>

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

		<!-- Reserve price -->
		<div class="mt-4 mb-2 font-semibold">Reserve Price</div>
		<TokenDropdown
			dropdownBg="white"
			dropdownColor="black"
			dropdownButtonBg="white"
			dropdownButtonColor="black"
			showLabel
			showArrow={false}
			tokens={listingTokens}
			buttonDisabled
			bind:value={reservePrice}
			on:select={(ev) => (paymentTokenTicker = ev.detail.label)}
		/>

		<!-- Starting price -->
		<div class="mt-4 font-semibold">Starting Price</div>
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

		<div class="flex items-center justify-between gap-x-1">
			{#if maxQuantity > 1}
				<div class="flex flex-col flex-grow">
					<div class="mt-4 font-semibold">Quantity</div>
					<div class="mt-2">
						<input type="number" class="w-full h-12 input input-hide-controls  border border-black" bind:value={quantity} max={maxQuantity} min={1} />
					</div>
				</div>
			{/if}

			<!-- Duration -->
			<div class="flex flex-col flex-grow">
				<div class="mt-4 mb-2 font-semibold">Duration</div>
				<Dropdown options={listingDurationOptions} on:select={(ev) => (duration = ev.detail.value)} borderOpacity={1} />
			</div>
		</div>
	{/if}

	<div class="flex-grow" />

	<!-- Fees -->
	<div class="mt-4 font-semibold">Fees</div>
	<div class="grid gap-2 mt-2 font-semibold" style:grid-template-columns="auto 6rem">
		<div>Creator Royalties:</div>
		<div class="flex justify-end space-x-3">
			<div class="">
				{(options.collectionData?.royalties?.reduce((acum, value) => acum + Number(value.fees ?? 0), 0) || 0) + ' %'}
			</div>
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
