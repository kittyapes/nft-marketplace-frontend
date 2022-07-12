<script lang="ts">
	import Weth from '$icons/weth.svelte';
	import { listingDurationOptions } from '$utils/contracts/listing';
	import { isPrice } from '$utils/validator/isPrice';
	import Datepicker from '../Datepicker.svelte';
	import Dropdown from '../Dropdown.svelte';
	import PriceInput from '../PriceInput.svelte';
	import InputSlot from './InputSlot.svelte';

	export let startDateTs: number;
	export let durationSeconds: number;
	export let startingPrice: string;
	export let reservePrice: string;

	export let formValid;

	$: {
		formValid = isPrice(startingPrice) && isPrice(reservePrice || '0');
	}
</script>

<div class="grid grid-cols-2 gap-x-8 gap-y-4">
	<InputSlot label="Start Date">
		<Datepicker dateOnly on:new-value={(ev) => (startDateTs = ev.detail.unix())} />
	</InputSlot>

	<InputSlot label="Duration">
		<Dropdown options={listingDurationOptions} on:select={(ev) => (durationSeconds = ev.detail.value)} />
	</InputSlot>

	<InputSlot label="Starting Price">
		<PriceInput bind:value={startingPrice} placeholder="1.0" tokenIconClass={Weth} />
	</InputSlot>

	<InputSlot label="Reserve Price">
		<PriceInput bind:value={reservePrice} placeholder="5.0" tokenIconClass={Weth} />
	</InputSlot>
</div>
