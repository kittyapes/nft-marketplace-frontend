<script lang="ts">
	import { keyBy } from 'lodash-es';

	import type { PropertyName } from './types';

	export let propertyNames: PropertyName[] = [];
	export let propertyValues: { [key: string]: string } = {};

	function is(propName: PropertyName) {
		return propertyNames?.includes(propName);
	}

	$: console.log(propertyNames);
</script>

<div class={$$props.class}>
	{#key propertyNames}
		{#if is('price')}
			Price
		{/if}

		{#if is('date')}
			Price
		{/if}

		{#if is('quantity')}
			Price
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
