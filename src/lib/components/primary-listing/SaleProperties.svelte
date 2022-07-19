<script lang="ts">
	import Weth from '$icons/weth.svelte';
	import { listingDurationOptions } from '$utils/contracts/listing';
	import { isPrice } from '$utils/validator/isPrice';
	import Datepicker from '../Datepicker.svelte';
	import Dropdown from '../Dropdown.svelte';
	import PriceInput from '../PriceInput.svelte';
	import InputSlot from './InputSlot.svelte';

	export let startDateTs: number;
	export let quantity: number;
	export let durationSeconds: number;
	export let price: string;

	export let hideQuantity = false;
	export let maxQuantity: number;

	export let disableStartDate = false;

	export let maxPrice: string = null;

	export let formValid = true;
	export let formErrors: string[] = [];

	$: {
		formErrors = [];

		if (!isPrice(price)) {
			formErrors.push('Price input value is invalid!');
		}

		if (quantity > (maxQuantity || 1)) {
			formErrors.push('Quantity field cannot contain a greater value than the number of ERC 1155 tokens you own!');
		}

		if (maxPrice !== null && parseFloat(price) > parseFloat(maxPrice)) {
			formErrors.push('New price cannot be higher than the current price.');
		}

		formErrors = formErrors;
	}

	$: formValid = !formErrors.length;

	$: if (maxQuantity <= 1) quantity = 1;

	export function setValues(options: { startDateTs: number; quantity: number; durationSeconds: number; price: string }) {
		_setDuration(listingDurationOptions.find((v) => v.value === options.durationSeconds));
		_setStartDateTs(options.startDateTs);
		quantity = options.quantity;
		price = options.price;
	}

	let _setDuration;
	let _setStartDateTs;

	$: console.log({ maxPrice });
</script>

<InputSlot label="Price">
	<PriceInput bind:value={price} placeholder="1.0" tokenIconClass={Weth} />
</InputSlot>

<InputSlot label="Quantity" hidden={hideQuantity}>
	<input type="number" class="w-full h-12 input input-hide-controls outline-none" bind:value={quantity} disabled={maxQuantity <= 1} />
</InputSlot>

<InputSlot label="Start Date">
	<Datepicker dateOnly on:new-value={(ev) => (startDateTs = ev.detail.unix())} bind:setWithTimestamp={_setStartDateTs} disabled={disableStartDate} />
</InputSlot>

<InputSlot label="Duration">
	<Dropdown options={listingDurationOptions} on:select={(ev) => (durationSeconds = ev.detail.value)} bind:setSelected={_setDuration} />
</InputSlot>
