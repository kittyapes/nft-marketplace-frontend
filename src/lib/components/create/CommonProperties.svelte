<script lang="ts">
	import Datepicker from '$lib/components/Datepicker.svelte';
	import TokenDropdown from '$lib/components/TokenDropdown.svelte';
	import type { ListingPropName } from '$lib/interfaces/drops';

	export let propNames: ListingPropName[] = [];
	export let propValues: { [key: string]: string } = {};

	function is(propName: ListingPropName) {
		return propNames?.includes(propName);
	}
</script>

<div class="{$$props.class} grid grid-cols-2 gap-x-16 gap-y-8 pr-8">
	{#key propNames}
		{#if is('price')}
			<label for="price-component">
				<span>Price</span>
				<TokenDropdown id="price-component" bind:value={propValues.price} />
			</label>
		{/if}

		{#if is('date')}
			<label for="datepicker-component">
				<div class="h-6 mb-2" />
				<!-- <input type="text" bind:value={propValues.date} placeholder="DD/MM/YYYY" /> -->
				<Datepicker id="datepicker-component" />
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
					bind:value={propValues.price}
					placeholder="5.00"
				/>
			</label>
		{/if}

		{#if is('auctionDuration')}
			<label for="datepicker-component">
				<span>Auction duration</span>
				<!-- <input type="text" bind:value={propValues.date} placeholder="DD/MM/YYYY" /> -->
				<Datepicker id="datepicker-component" placeholder="DD/HH/MM" />
			</label>
		{/if}

		{#if is('entryTickets')}{/if}

		{#if is('ticketPrice')}{/if}

		{#if is('totalTickets')}{/if}

		{#if is('raffleDuration')}{/if}

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
