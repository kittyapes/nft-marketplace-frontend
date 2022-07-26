<script lang="ts">
	import Weth from '$icons/weth.svelte';
	import type { ConfigurableListingProps } from '$interfaces/listing';
	import { listingDurationOptions } from '$utils/contracts/listing';
	import { isPrice } from '$utils/validator/isPrice';
	import AttachToElement from '../AttachToElement.svelte';
	import Datepicker from '../Datepicker.svelte';
	import Dropdown from '../Dropdown.svelte';
	import PriceInput from '../PriceInput.svelte';
	import InfoBubble from '../v2/InfoBubble/InfoBubble.svelte';
	import InputSlot from './InputSlot.svelte';

	export let props: Partial<ConfigurableListingProps> = {};
	export let disabled = false;
	export let formErrors: string[] = [];

	$: isReserveValid = !isPrice(props.startingPrice) || !props.reservePrice || parseFloat(props.reservePrice) > parseFloat(props.startingPrice);
	$: {
		formErrors = [];

		if (!isPrice(props.startingPrice)) {
			formErrors.push('Starting price has invalid value.');
		}

		if (!isPrice(props.reservePrice || props.startingPrice)) {
			formErrors.push('Reserve price has invalid value.');
		}

		if (props.reservePrice && parseFloat(props.reservePrice) <= parseFloat(props.startingPrice)) {
			formErrors.push('Reserve price must be greater than starting price.');
		}

		formErrors = formErrors;
	}

	let divPriceInput: HTMLElement;
</script>

<InputSlot label="Start Date">
	<Datepicker dateOnly on:new-value={(ev) => (props.startDateTs = ev.detail.unix())} {disabled} />
</InputSlot>

<InputSlot label="Duration">
	<Dropdown options={listingDurationOptions} on:select={(ev) => (props.durationSeconds = ev.detail.value)} {disabled} />
</InputSlot>

<InputSlot label="Starting Price">
	<PriceInput bind:value={props.startingPrice} placeholder="1.0" tokenIconClass={Weth} {disabled} />
</InputSlot>

<InputSlot label="Reserve Price (Optional)">
	<div bind:this={divPriceInput}>
		<PriceInput bind:value={props.reservePrice} placeholder="5.0" tokenIconClass={Weth} validOverride={isReserveValid} {disabled} />
	</div>
</InputSlot>

{#if !isReserveValid}
	<AttachToElement to={divPriceInput} bottom>
		<InfoBubble>Reserve price of your listing must be greater than the starting price.</InfoBubble>
	</AttachToElement>
{/if}
