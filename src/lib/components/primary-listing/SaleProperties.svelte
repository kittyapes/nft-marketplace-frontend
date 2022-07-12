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

	export let maxQuantity: number;

	export let formValid;

	$: {
		formValid = isPrice(price) && quantity <= maxQuantity;
	}

	$: if (maxQuantity <= 1) quantity = 1;
</script>

<div class="grid grid-cols-2 gap-x-8 gap-y-4">
	<InputSlot label="Price">
		<PriceInput bind:value={price} placeholder="1.0" tokenIconClass={Weth} />
	</InputSlot>

	<InputSlot label="Quantity">
		<input type="number" class="w-full h-12 input input-hide-controls" bind:value={quantity} disabled={maxQuantity <= 1} />
	</InputSlot>

	<InputSlot label="Start Date">
		<Datepicker dateOnly on:new-value={(ev) => (startDateTs = ev.detail.unix())} />
	</InputSlot>

	<InputSlot label="Duration">
		<Dropdown options={listingDurationOptions} on:select={(ev) => (durationSeconds = ev.detail.value)} />
	</InputSlot>
</div>
