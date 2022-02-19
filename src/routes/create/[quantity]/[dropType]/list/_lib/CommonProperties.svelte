<script lang="ts">
	import Datepicker from '$lib/components/Datepicker.svelte';
	import TokenDropdown from '$lib/components/TokenDropdown.svelte';
	import type { PropertyName } from './types';

	export let propNames: PropertyName[] = [];
	export let propValues: { [key: string]: string } = {};

	function is(propName: PropertyName) {
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

		{#if is('quantity')}
			<label>
				<span>Quantity</span>
				<input type="text" bind:value={propValues.quantity} placeholder="Enter quantity number" />
			</label>
		{/if}

		{#if is('listingDate')}
			Price
		{/if}

		{#if is('reservePrice')}
			Price
		{/if}

		{#if is('auctionDate')}
			Price
		{/if}

		{#if is('auctionDuration')}
			Price
		{/if}

		{#if is('entryTickets')}
			Price
		{/if}

		{#if is('ticketPrice')}
			Price
		{/if}

		{#if is('totalTickets')}
			Price
		{/if}

		{#if is('raffleDuration')}
			Price
		{/if}

		{#if is('claimsBegin')}
			Price
		{/if}

		{#if is('claimsDuration')}
			Price
		{/if}

		{#if is('cutPrice')}
			Price
		{/if}

		{#if is('preQueueOpens')}
			Price
		{/if}

		{#if is('queueDuration')}
			Price
		{/if}

		{#if is('gachaContract')}
			Price
		{/if}

		{#if is('dateOfRelease')}
			Price
		{/if}

		{#if is('initialPrice')}
			Price
		{/if}
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
