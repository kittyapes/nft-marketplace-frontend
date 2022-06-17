<script lang="ts">
	import { WethContractAddress } from '$constants/contractAddresses';
	import Info from '$icons/info.v2.svelte';
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import TokenDropdown from '$lib/components/TokenDropdown.svelte';
	import type { ListingType } from '$utils/api/listing';
	import { saleList } from '$utils/flows/saleList';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import { getTokenAddress } from '$utils/misc/getTokenAddress';
	import { notifyError } from '$utils/toast';
	import dayjs from 'dayjs';
	import { BigNumber } from 'ethers';
	import { parseEther } from 'ethers/lib/utils';
	import { createEventDispatcher } from 'svelte';
	import ListingTypeSwitch from './ListingTypeSwitch.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardPopupOptions;

	let selectedListingType: ListingType = 'sale';

	const tokens = [{ label: 'WETH', iconUrl: getIconUrl('eth.black'), value: WethContractAddress }];
	const durationOptions = [
		{ label: '1 day', value: 1 * 24 * 3600 },
		{ label: '3 days', value: 3 * 24 * 3600 },
		{ label: '7 days', value: 7 * 24 * 3600 },
		{ label: '1 month', value: 30 * 24 * 3600 },
		{ label: '3 months', value: 90 * 24 * 3600 },
		{ label: '6 months', value: 180 * 24 * 3600 }
	];

	let price: any;
	let paymentTokenTicker: string;
	let duration: number;

	$: console.log(price, paymentTokenTicker, duration);

	$: formValid = price > 0;

	let isListing = false;

	async function completeListing() {
		isListing = true;

		const { err } = await saleList({
			title: options.nftData[0].metadata?.title,
			description: options.nftData[0].metadata?.description,
			duration,
			price: parseEther(price.toString()),
			nfts: [{ nftId: options.nftData[0].tokenId, amount: 1 }],
			paymentTokenAddress: getTokenAddress(paymentTokenTicker as any),
			paymentTokenTicker,
			quantity: BigNumber.from(1),
			startTime: dayjs().unix() + 10000
		});

		if (err) {
			console.error(err);
			notifyError(err.message);
		} else {
			dispatch('set-state', { name: 'success', props: { successDescription: 'Successfully listed.', showMarketplaceButton: false } });
		}

		isListing = false;
	}
</script>

<div>
	<!-- Listing Type -->
	<div class="mt-4 font-semibold">Listing Type</div>
	<div class="mt-2"><ListingTypeSwitch /></div>

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
				{tokens}
				buttonDisabled
				bind:value={price}
				on:select={(ev) => (paymentTokenTicker = ev.detail.label)}
			/>
		</div>

		<!-- Duration -->
		<div class="mt-4 font-semibold">Duration</div>
		<div class="mt-2">
			<Dropdown options={durationOptions} on:select={(ev) => (duration = ev.detail.value)} borderOpacity={1} />
		</div>

		<!-- Specific buyer -->
		{#if false}
			<div class="flex mt-4 space-x-2">
				<Toggle --width="3rem" onInsideLabel="" offInsideLabel="" />
				<div class="font-semibold">Reserve for specific buyer</div>
			</div>
		{/if}

		<!-- Fees -->
		<div class="mt-4 font-semibold">Fees</div>
		<div class="grid gap-2 mt-2 font-semibold" style:grid-template-columns="auto 6rem">
			<div>Creator Royalties:</div>
			<div class="flex justify-end space-x-2">
				<div class="">0.0%</div>
				<div class="w-6">
					<Info />
				</div>
			</div>

			<div class="gradient-text">Hinata Fees:</div>
			<div class="flex justify-end space-x-2">
				<div class="gradient-text">0%</div>
				<div class="w-6">
					<Info />
				</div>
			</div>
		</div>
	{/if}

	<button class="w-full mt-8 uppercase transition btn btn-gradient btn-rounded" disabled={!formValid || isListing} on:click={completeListing}>Complete Listing</button>
</div>
