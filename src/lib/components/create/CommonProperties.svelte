<script lang="ts">
	import Datepicker from '$lib/components/Datepicker.svelte';
	import TokenDropdown from '$lib/components/TokenDropdown.svelte';
	import type { ListingPropName } from '$lib/interfaces/drops';
	import { isPrice } from '$utils/validator/isPrice';
	import DurationSelect from '../DurationSelect.svelte';
	import RadioGroup from '../RadioGroup.svelte';

	const propValidators: Record<string, (s) => boolean> = {
		price: isPrice,
		date: (v) => v
	};

	export let propNames: ListingPropName[] = [];
	export let propValues: { [key: string]: any } = {};
	export let isValid: boolean = false;

	function is(propName: ListingPropName) {
		return propNames?.includes(propName);
	}

	$: validations = Object.entries(propValidators).reduce((acc, [propName, validator]) => {
		const value = propValues[propName];
		acc[propName] = validator(value);
		return acc;
	}, {});

	$: isValid = Object.entries(validations).every(([, isValid]) => isValid);
</script>

<div class="{$$props.class} grid grid-cols-2 gap-x-16 gap-y-8 pr-8">
	{#key propNames}
		{#if is('entryTickets')}
			<div>
				<span class="uppercase italic font-light block mb-4">Entry tickets</span>
				<RadioGroup
					name="entry-tickets"
					options={[
						{ label: 'Price to enter', value: 'price-to-enter' },
						{ label: 'Free entry tickets', value: 'free-entry-tickets' }
					]}
				/>
			</div>

			<div />
		{/if}

		{#if is('ticketPrice')}
			<label for="price-component">
				<span>Ticket price</span>
				<TokenDropdown
					id="price-component"
					bind:value={propValues.price}
					placeholder="Enter price for tickets"
				/>
			</label>{/if}

		{#if is('price')}
			<label for="price-component">
				<span>Price</span>
				<TokenDropdown
					id="price-component"
					bind:value={propValues.price}
					valid={validations.price}
				/>
			</label>
		{/if}

		{#if is('totalTickets')}
			<label>
				<span>Total tickets</span>
				<input type="text" class="input h-12 w-full" placeholder="Enter tickets number" />
			</label>
		{/if}

		{#if is('date')}
			<label for="datepicker-component">
				<div class="h-6 mb-2" />
				<!-- <input type="text" bind:value={propValues.date} placeholder="DD/MM/YYYY" /> -->
				<Datepicker id="datepicker-component" bind:value={propValues.date} />
			</label>
		{/if}

		{#if is('listingDate')}{/if}

		{#if is('auctionDate')}
			<label for="datepicker-component">
				<span class="!font-medium !not-italic">
					Date of auction <span class="gradient-text">(Optional)</span>
				</span>
				<!-- <input type="text" bind:value={propValues.date} placeholder="DD/MM/YYYY" /> -->
				<Datepicker id="datepicker-component" />
			</label>
		{/if}

		{#if is('reservePrice')}
			<label for="reserve-price-component">
				<span>Reserve price</span>
				<TokenDropdown
					id="reserve-price-component"
					bind:value={propValues.reservePrice}
					placeholder="5.00"
				/>
			</label>
		{/if}

		{#if is('auctionDuration')}
			<label for="auction-duration-component">
				<span>Auction duration</span>
				<DurationSelect id="auction-duration-component" />
			</label>
		{/if}

		{#if is('raffleDuration')}
			<label for="raffle-duration-component">
				<span>Raffle Duration</span>
				<DurationSelect id="raffle-duration-component" />
			</label>
		{/if}

		{#if is('claimsBegin')}{/if}

		{#if is('claimsDuration')}{/if}

		{#if is('cutPrice')}{/if}

		{#if is('preQueueOpens')}{/if}

		{#if is('queueDuration')}{/if}

		{#if is('gachaContract')}{/if}

		{#if is('dateOfRelease')}{/if}

		{#if is('initialPrice')}{/if}
	{/key}
</div>

<style>
	label > span {
		@apply uppercase italic font-light block mb-2;
	}

	/* :global(input),
	input {
		@apply block h-12 border border-opacity-30 focus:border-opacity-100
		border-[#1D1D1D] rounded-lg outline-none !mt-2 px-4 w-full;
	} */
</style>
