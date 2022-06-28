<script lang="ts">
	import Datepicker from '$lib/components/Datepicker.svelte';
	import TokenDropdown from '$lib/components/TokenDropdown.svelte';
	import { isPrice } from '$utils/validator/isPrice';
	import { parseEther } from 'ethers/lib/utils.js';
	import { noTry } from 'no-try';
	import type { ListingPropName } from 'src/interfaces/drops';
	import Dropdown from '../Dropdown.svelte';

	const propValidators: Record<ListingPropName, (s) => boolean> = {
		price: isPrice,
		startDate: (v) => v,
		startingPrice: (v) => !v || noTry(() => parseEther(v))[1]?.gt(0),
		reservePrice: (v) => noTry(() => parseEther(v))[1]?.gt(0),
		quantity: () => true,
		duration: () => true,
		token: () => true
	};

	export let propNames: ListingPropName[] = [];
	export let propValues: { [key: string]: any } = {
		quantity: 1
	};
	export let isValid: boolean = false;

	function is(propName: ListingPropName) {
		return propNames?.includes(propName);
	}

	$: validations = Object.entries(propValidators).reduce((acc, [propName, validator]: [ListingPropName, (v: any) => boolean]) => {
		if (!propNames.includes(propName)) return acc;

		const value = propValues[propName];
		acc[propName] = validator(value);
		return acc;
	}, {} as Record<ListingPropName, boolean>);

	$: console.log(validations);

	$: isValid = Object.entries(validations).every(([, isValid]) => isValid);

	// Duration
	const durationOptions = [
		{ label: '1 day', value: 1 },
		{ label: '3 days', value: 3 },
		{ label: '7 days', value: 7 },
		{ label: '1 month', value: 30 },
		{ label: '3 months', value: 90 },
		{ label: '6 months', value: 180 }
	];
</script>

<div class="{$$props.class} grid lg:grid-cols-2 gap-x-16 gap-y-8 pr-8">
	{#key propNames}
		<!-- {#if is('entryTickets')}
			<div>
				<span class="block mb-4 font-light uppercase">Entry tickets</span>
				<RadioGroup
					name="entry-tickets"
					options={[
						{ label: 'Price to enter', value: 'price-to-enter' },
						{ label: 'Free entry tickets', value: 'free-entry-tickets' }
					]}
				/>
			</div>

			<div />
		{/if} -->

		<!-- {#if is('ticketPrice')}
			<label for="price-component">
				<span>Ticket price</span>
				<TokenDropdown id="price-component" bind:value={propValues.price} placeholder="Enter price for tickets" />
			</label>{/if} -->

		{#if is('price')}
			<label for="price-component">
				<span>Price</span>
				<TokenDropdown on:select id="price-component" bind:value={propValues.price} valid={validations.price} bind:selected={propValues.token} />
			</label>
		{/if}

		<!-- {#if is('totalTickets')}
			<label>
				<span>Total tickets</span>
				<input type="text" class="w-full h-12 input" placeholder="Enter tickets number" />
			</label>
		{/if} -->

		{#if is('startDate')}
			<label for="datepicker-component">
				<span>Start Date</span>
				<Datepicker id="datepicker-component" dateOnly bind:value={propValues['startDate']} />
			</label>
		{/if}

		{#if is('quantity')}
			<label for="price-component">
				<span>Quantity</span>
				<input type="number" class="w-full h-12 input input-hide-controls" bind:value={propValues['quantity']} />
			</label>
		{/if}

		{#if is('duration')}
			<label for="">
				<span>Duration</span>
				<Dropdown options={durationOptions} bind:selected={propValues['duration']} />
			</label>
		{/if}

		{#if is('startingPrice')}
			<label for="starting-price-component">
				<span>Starting price</span>
				<TokenDropdown id="starting-price-component" bind:value={propValues.startingPrice} placeholder="5.00" />
			</label>
		{/if}

		{#if is('reservePrice')}
			<label for="reserve-price-component">
				<span>Reserve price</span>
				<TokenDropdown id="reserve-price-component" bind:value={propValues.reservePrice} placeholder="5.00" bind:selected={propValues.token} />
			</label>
		{/if}
	{/key}
</div>

<style type="postcss">
	label > span {
		@apply uppercase block mb-2;
	}

	/* :global(input),
	input {
		@apply block h-12 border border-opacity-30 focus:border-opacity-100
		border-[#1D1D1D] rounded-lg outline-none !mt-2 px-4 w-full;
	} */
</style>
