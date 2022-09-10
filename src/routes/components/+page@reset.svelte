<script lang="ts">
	import Countdown from '$lib/components/v2/Countdown/Countdown.svelte';
	import { contractCompleteAuction } from '$utils/contracts/auction';
	import { contractCancelListing } from '$utils/contracts/listing';
	import { refreshConnection } from '$utils/wallet/connectWallet';
	import { onMount } from 'svelte';

	let listingId: string;
	let auctionErr;

	async function acceptHighest() {
		const { err } = await contractCompleteAuction(listingId);
		auctionErr = err;
	}

	async function cancelListing() {
		try {
			await contractCancelListing(listingId);
		} catch (err) {
			auctionErr = err;
		}
	}

	onMount(refreshConnection);
</script>

<main class="max-w-screen-lg p-8 mx-auto my-24 border bg-gray-50 rounded-xl">
	<h1 class="text-xl font-semibold">Welcome to the components route!</h1>

	<div class="p-8 mt-4 bg-white rounded-xl">
		<Countdown startTime={new Date().toISOString()} duration={3600} />
	</div>

	<h2 class="text-lg font-medium mt-4">Auction contract testing!</h2>

	<div class="mt-2">Listing ID</div>
	<input type="text" class="mt-2 h-10 rounded-lg border px-4" bind:value={listingId} />

	<pre class="whitespace-pre-wrap overflow-hidden">
		{auctionErr}
	</pre>

	<div class="flex mt-2 gap-2">
		<button on:click={acceptHighest}>Accept Highest Bid</button>
		<button on:click={cancelListing}>Cancel Auction</button>
	</div>
</main>

<style>
	button {
		@apply px-4 py-2 font-medium border rounded-lg bg-gray-100 active:opacity-60;
	}
</style>
