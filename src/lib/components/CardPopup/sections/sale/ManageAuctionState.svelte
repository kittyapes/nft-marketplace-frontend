<!-- <script>
	import AuctionBidRow from '$lib/components/v2/AuctionBidRow.svelte';
</script>

<div class="flex flex-col h-full pb-8 mt-4">
	<div class="flex flex-col flex-grow p-4 overflow-hidden border rounded-lg">
		<div class="font-medium opacity-70">Bids</div>
		<div class="flex flex-col flex-grow gap-4 pr-4 mt-4 overflow-y-scroll">
			{#each biddings as bid}
				<AuctionBidRow {...bid} tokenIconComponent={Eth} />
			{/each}
		</div>
	</div>

	<div class="flex gap-2 mt-2">
		<button class="grid w-12 h-12 p-2 border rounded-lg place-items-center" disabled><Eth /></button>
		<Input class="border-opacity-20" placeholder="Enter amount" bind:value={bidAmount} validator={bidValidator} bind:valid={bidAmountValid} />
	</div>

	<div class="flex gap-2 mt-4">
		{#if false}
			<Button borderColor="gradient" textColor="gradient" uppercase>Cancel Bid</Button>
		{/if}
		<Button class="bg-gradient-to-r from-color-purple to-color-blue" uppercase on:click={placeBid} disabled={!bidAmountValid || !bidAmount}>Place Bid</Button>
	</div>
</div> -->
