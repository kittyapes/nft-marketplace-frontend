<script lang="ts">
	import Weth from '$icons/weth.svelte';

	import type { ConfigurableListingProps } from '$interfaces/listing';
	import { isMaxTwoWeeksInFuture } from '$utils';
	import type { ListingType } from '$utils/api/listing';
	import { userHasRole } from '$utils/auth/userRoles';
	import { buildListingDurationOptions, type ListingDurationOption } from '$utils/misc';
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
	export let maxQuantity: number = null;
	export let hideQuantity = false;
	export let disableQuantity = false;
	export let disableStartDate = false;
	export let disabled = false;
	export let minDuration = 0;

	export let disableQuantityCheck = false;

	$: sale = listingType === 'sale';
	$: auction = listingType === 'auction';

	$: durationOptions = buildListingDurationOptions(
		$userHasRole('admin', 'superadmin'),
		minDuration,
	);

	export let formErrors: string[] = [];

	let quantityError = null;
	let reservePriceError = null;

	$: {
		formErrors = [];

		quantityError = null;
		reservePriceError = null;

		if (!disableQuantityCheck && props.quantity > (maxQuantity || 1)) {
			quantityError =
				'Quantity field cannot contain a greater value than the number of ERC 1155 tokens you own.';
			formErrors.push(quantityError);
		} else if (props.quantity < 1) {
			quantityError = 'You must list at least one token.';
			formErrors.push(quantityError);
		} else if (Math.floor(props.quantity) !== props.quantity) {
			quantityError = 'Quantity field cannot contain the decimals.';
			formErrors.push(quantityError);
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

		if (
			auction &&
			props.reservePrice &&
			parseFloat(props.reservePrice) <= parseFloat(props.startingPrice)
		) {
			reservePriceError = 'Reserve price must be greater than starting price.';
			formErrors.push(reservePriceError);
		}

		formErrors = formErrors;
	}

	$: if (maxQuantity <= 1) props.quantity = 1;

	export function setValues(
		options: Partial<{
			startDateTs: number;
			quantity: number;
			durationSeconds: number;
			price: string;
		}>,
	) {
		options.durationSeconds &&
			_setDuration(durationOptions.find((v) => v.value === options.durationSeconds));
		options.startDateTs && _setStartDateTs(options.startDateTs);

		if (options.quantity) {
			props.quantity = options.quantity;
		}

		if (options.price) {
			props.price = options.price;
		}
	}

	let _setDuration;
	let _setStartDateTs;

	$: _disableQuantity = maxQuantity <= 1 || disabled || disableQuantity;

	function handleDurationOptionsSelect(ev: { detail: ListingDurationOption }) {
		props.durationSeconds = ev.detail.value;
	}
</script>

<div class="grid gap-x-8 gap-y-4" class:grid-cols-2={compact}>
	{#if sale}
		<InputSlot label="Price">
			<PriceInput
				bind:value={props.price}
				placeholder="1.0"
				tokenIconClass={Weth}
				tokenLabel="wETH"
				{disabled}
			/>
		</InputSlot>
	{/if}

	<InputSlot label="Start Date">
		<Datepicker
			dateOnly
			on:new-value={(ev) => (props.startDateTs = ev.detail.unix())}
			bind:setWithTimestamp={_setStartDateTs}
			disabled={disableStartDate || disabled}
			dateEnabledPred={isMaxTwoWeeksInFuture}
		/>
	</InputSlot>

	<InputSlot label="Duration">
		<Dropdown
			options={durationOptions}
			on:select={handleDurationOptionsSelect}
			bind:setSelected={_setDuration}
			{disabled}
			class="h-12"
		/>
	</InputSlot>

	<InputSlot label="Quantity" hidden={hideQuantity}>
		<div
			class="relative flex items-center gap-3 border {(quantityError &&
				'border-red-500 focus:border-red-500') ||
				''}"
			class:opacity-50={disabled}
			class:pr-4={!disableQuantity}
		>
			<input
				type="number"
				class="w-full h-12 border-none outline-none input-hide-controls pl-4 bg-transparent"
				class:bg-[#ffffff22]={_disableQuantity}
				bind:value={props.quantity}
				disabled={_disableQuantity}
			/>

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

	{#if auction}
		<InputSlot label="Starting Price">
			<PriceInput
				bind:value={props.startingPrice}
				placeholder="1.0"
				tokenIconClass={Weth}
				tokenLabel="wETH"
				{disabled}
			/>
		</InputSlot>

		<InputSlot label="Reserve Price (Optional)">
			<div class="relative">
				<PriceInput
					bind:value={props.reservePrice}
					placeholder="5.0"
					tokenIconClass={Weth}
					tokenLabel="wETH"
					validOverride={reservePriceError === null}
					{disabled}
				/>

				{#if reservePriceError}
					<div class="absolute z-10 top-12">
						<InfoBubble>{reservePriceError}</InfoBubble>
					</div>
				{/if}
			</div>
		</InputSlot>
	{/if}
</div>
