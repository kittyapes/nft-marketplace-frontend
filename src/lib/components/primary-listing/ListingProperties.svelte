<script lang="ts">
	import Weth from '$icons/weth.svelte';

	import type { ConfigurableListingProps } from '$interfaces/listing';
	import type { ListingType } from '$utils/api/listing';
	import { listingDurationOptions } from '$utils/contracts/listing';
	import { isPrice } from '$utils/validator/isPrice';
	import Datepicker from '../Datepicker.svelte';
	import Dropdown from '../Dropdown.svelte';
	import PriceInput from '../PriceInput.svelte';
	import InfoBubble from '../v2/InfoBubble/InfoBubble.svelte';
	import InputSlot from './InputSlot.svelte';

	export let props: Partial<ConfigurableListingProps> = {} as any;
	export let listingType: ListingType;
	export let compact = false;

	export let maxPrice: string = null;
	export let maxQuantity: number;
	export let hideQuantity = false;
	export let disableQuantity = false;
	export let disableStartDate = false;
	export let disabled = false;

	$: sale = listingType === 'sale';
	$: auction = listingType === 'auction';

	export let formErrors: string[] = [];

	let quantityError = null;
	let reservePriceError = null;

	$: {
		formErrors = [];

		quantityError = null;
		reservePriceError = null;

		if (props.quantity > (maxQuantity || 1)) {
			quantityError = 'Quantity field cannot contain a greater value than the number of ERC 1155 tokens you own.';
			formErrors.push(quantityError);
		}

		if (props.quantity < 1) {
			quantityError = 'You must list at least one token.';
		}

		// Sale
		if (sale && !isPrice(props.price)) {
			formErrors.push('Price input value is invalid!');
		}

		if (sale && maxPrice !== null && parseFloat(props.price) > parseFloat(maxPrice)) {
			formErrors.push('New price cannot be higher than the current price.');
		}

		// Auction
		if (auction && !isPrice(props.startingPrice)) {
			formErrors.push('Starting price has invalid value.');
		}

		if (auction && props.reservePrice && !isPrice(props.reservePrice || props.startingPrice)) {
			reservePriceError = 'Reserve price has invalid value.';
			formErrors.push(reservePriceError);
		}

		if (auction && props.reservePrice && parseFloat(props.reservePrice) <= parseFloat(props.startingPrice)) {
			reservePriceError = 'Reserve price must be greater than starting price.';
			formErrors.push(reservePriceError);
		}

		formErrors = formErrors;
	}

	$: if (maxQuantity <= 1) props.quantity = 1;

	export function setValues(options: { startDateTs: number; quantity: number; durationSeconds: number; price: string }) {
		_setDuration(listingDurationOptions.find((v) => v.value === options.durationSeconds));
		_setStartDateTs(options.startDateTs);
		props.quantity = options.quantity;
		props.price = options.price;
	}

	let _setDuration;
	let _setStartDateTs;

	$: _disableQuantity = maxQuantity <= 1 || disabled || disableQuantity;
</script>

<div class="grid gap-x-8 gap-y-4" class:grid-cols-2={compact}>
	<InputSlot label="Start Date">
		<Datepicker dateOnly on:new-value={(ev) => (props.startDateTs = ev.detail.unix())} bind:setWithTimestamp={_setStartDateTs} disabled={disableStartDate || disabled} />
	</InputSlot>

	<InputSlot label="Duration">
		<Dropdown options={listingDurationOptions} on:select={(ev) => (props.durationSeconds = ev.detail.value)} bind:setSelected={_setDuration} {disabled} />
	</InputSlot>

	<InputSlot label="Quantity" hidden={hideQuantity}>
		<div class="relative flex items-center gap-3 pr-4 rounded-md border {(quantityError && 'border-red-500 focus:border-red-500') || ''}" class:bg-gray-100={_disableQuantity}>
			<input type="number" class="w-full h-12 border-none outline-none input input-hide-controls" bind:value={props.quantity} disabled={_disableQuantity} />

			<!-- Disable quantity is true only on EditSale screen. We do not wanna show it since the edit quantity
		functionality is not implemented.  -->
			{#if !disableQuantity}
				<div class="font-semibold whitespace-nowrap">of {maxQuantity}</div>
			{/if}

			{#if quantityError}
				<div class="absolute z-10 top-14 left-4">
					<InfoBubble>{quantityError}</InfoBubble>
				</div>
			{/if}
		</div>
	</InputSlot>

	{#if auction && compact}
		<div />
	{/if}

	{#if sale}
		<InputSlot label="Price">
			<PriceInput bind:value={props.price} placeholder="1.0" tokenIconClass={Weth} {disabled} />
		</InputSlot>
	{/if}

	{#if auction}
		<InputSlot label="Starting Price">
			<PriceInput bind:value={props.startingPrice} placeholder="1.0" tokenIconClass={Weth} {disabled} />
		</InputSlot>

		<InputSlot label="Reserve Price (Optional)">
			<div class="relative">
				<PriceInput bind:value={props.reservePrice} placeholder="5.0" tokenIconClass={Weth} validOverride={reservePriceError} {disabled} />

				{#if reservePriceError}
					<div class="absolute z-10 top-12">
						<InfoBubble>{reservePriceError}</InfoBubble>
					</div>
				{/if}
			</div>
		</InputSlot>
	{/if}
</div>