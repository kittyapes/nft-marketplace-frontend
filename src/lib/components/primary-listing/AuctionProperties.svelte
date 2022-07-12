<script lang="ts">
	import Weth from '$icons/weth.svelte';
	import { listingDurationOptions } from '$utils/contracts/listing';
	import { getKnownTokenDetails, parseToken } from '$utils/misc/priceUtils';
	import { isPrice } from '$utils/validator/isPrice';
	import AttachToElement from '../AttachToElement.svelte';
	import Datepicker from '../Datepicker.svelte';
	import Dropdown from '../Dropdown.svelte';
	import PriceInput from '../PriceInput.svelte';
	import InfoBubble from '../v2/InfoBubble/InfoBubble.svelte';
	import InputSlot from './InputSlot.svelte';

	export let startDateTs: number;
	export let durationSeconds: number;
	export let startingPrice: string;
	export let reservePrice: string;
	export let token = 'WETH';

	export let formValid;

	$: tokenAddress = getKnownTokenDetails({ ticker: token }).address;

	$: isReserveValid = !isPrice(startingPrice) || !isPrice(reservePrice) || parseToken(reservePrice, tokenAddress).gt(parseToken(startingPrice, tokenAddress));
	$: {
		formValid = isPrice(startingPrice) && isPrice(reservePrice || '0');
		formValid = formValid && isReserveValid;
	}

	let divPriceInput: HTMLElement;
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

	<InputSlot label="Reserve Price (Optional)">
		<div bind:this={divPriceInput}>
			<PriceInput bind:value={reservePrice} placeholder="5.0" tokenIconClass={Weth} validOverride={isReserveValid} />
		</div>
	</InputSlot>
</div>

{#if !isReserveValid}
	<AttachToElement to={divPriceInput} bottom>
		<InfoBubble>Reserve price of your listing must be greater than the starting price.</InfoBubble>
	</AttachToElement>
{/if}
