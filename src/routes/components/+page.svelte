<script lang="ts">
	import Countdown from '$lib/components/v2/Countdown/Countdown.svelte';
	import type { Listing } from '$utils/api/listing';
	import { contractCompleteAuction } from '$utils/contracts/auction';
	import { cancelListingFlow } from '$utils/flows/cancelListingFlow';
	import { refreshConnection } from '$utils/wallet/connectWallet';
	import { onMount } from 'svelte';
	import CheckFilterDropdownDemo from './CheckFilterDropdownDemo.svelte';
	import DemoContainer from './DemoContainer.svelte';
	import FilterChipDemo from './FilterChipDemo.svelte';
	import HomepageCarouselDemo from './HomepageCarouselDemo.svelte';
	import NftActivityHistoryTableDemo from './NftActivityHistoryTableDemo.svelte';

	let listingId: string;
	let auctionErr;

	async function acceptHighest() {
		const { err } = await contractCompleteAuction(listingId);
		auctionErr = err;
	}

	async function cancelListing() {
		await cancelListingFlow({ listingId, chainStatus: 'ON_CHAIN' } as Listing);
	}

	onMount(refreshConnection);
</script>

<main class="max-w-screen-lg p-8 mx-auto my-24 border bg-gray-50 rounded-xl grid space-y-4">
	<h1 class="text-xl font-semibold">Welcome to the components route!</h1>

	<div class="p-8 mt-4 bg-white rounded-xl">
		<Countdown startTime={new Date().toISOString()} duration={3600} />
	</div>

	<h2 class="mt-4 text-lg font-medium">Auction contract testing!</h2>

	<div class="mt-2">Listing ID</div>
	<input type="text" class="h-10 px-4 mt-2 border rounded-lg" bind:value={listingId} />

	<pre class="overflow-hidden whitespace-pre-wrap">
		{auctionErr}
	</pre>

	<div class="flex gap-2 mt-2">
		<button on:click={acceptHighest}>Accept Highest Bid</button>
		<button on:click={cancelListing}>Cancel Auction</button>
	</div>

	<DemoContainer title="FilterChip">
		<FilterChipDemo />
	</DemoContainer>

	<DemoContainer title="CheckFilterDropdown">
		<CheckFilterDropdownDemo />
	</DemoContainer>

	<DemoContainer title="NftActivityHistoryTable">
		<NftActivityHistoryTableDemo />
	</DemoContainer>

	<DemoContainer title="HomepageCarousel">
		<HomepageCarouselDemo />
	</DemoContainer>
</main>

<style>
	button {
		@apply px-4 py-2 font-medium border rounded-lg bg-gray-100 active:opacity-60;
	}
</style>
