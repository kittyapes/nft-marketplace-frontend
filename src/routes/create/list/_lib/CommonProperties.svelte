<script lang="ts">
	import type { PropertyName } from './types';

	export let propNames: PropertyName[] = [];
	export let propValues: { [key: string]: string } = {};

	function is(propName: PropertyName) {
		return propNames?.includes(propName);
	}

	$: console.log(propNames);
</script>

<div class="{$$props.class} grid grid-cols-2 gap-x-16 gap-y-8 pr-8">
	{#key propNames}
		{#if is('price')}
			<label>
				Price
				<input type="text" bind:value={propValues.price} placeholder="Enter price for NFT" />
			</label>
		{/if}

		{#if is('date')}
			<label>
				<div class="h-6" />
				<input type="text" bind:value={propValues.date} placeholder="DD/MM/YYYY" />
			</label>
		{/if}

		{#if is('quantity')}
			<label>
				Quantity
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
	label {
		@apply uppercase italic font-light;
	}

	input {
		@apply block h-12 border border-opacity-30 focus:border-opacity-100 border-[#1D1D1D] rounded-lg outline-none mt-2 px-4 w-full;
	}
</style>
