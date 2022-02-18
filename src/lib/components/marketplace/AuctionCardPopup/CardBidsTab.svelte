<script lang="ts">
	import { fade } from 'svelte/transition';
	import CardBidsRow from './CardBidsRow.svelte';
	import Button from '$lib/components/Button.svelte';

	export let rowInfo: PopupRowInfo[] = Array(20).fill(0).map((_, i) => ({id: i, message: 'Placed a bid for', nickname: 'Mitchell', imageUrl: '', ammount: 3.50} as PopupRowInfo))
	export let currentBid: number = 3.50;
	export let ethereumUsdRate: number = 2878.62;
	export let endingInMiliseconds: Date = new Date();
	
</script>

<div class="w-full h-full flex flex-col" in:fade={{ duration: 300 }}>
	<div class="flex-grow h-auto flex-shrink overflow-y-scroll tab-content">
		{#each rowInfo as row}
			<CardBidsRow {row} first={row.id === 0}/>
		{/each}
	</div>
	<div class="w-full bottom-0 flex-shrink">
		<div>
			<div class="w-full border-t border-color-black border-opacity-30 flex">
				<div class="w-1/2 border-r border-color-black border-opacity-30 pt-2">
					<div class="text-sm text-color-black opacity-70 ">Current Bid</div>
					<div class="text-2xl font-semibold text-color-black"> ${currentBid*ethereumUsdRate} | {currentBid} Ξ</div>
				</div>

				<div class="w-1/2 pt-2 pl-4">
					<div class="text-sm text-color-black opacity-70 ">Ending in</div>
					<div class="text-2xl font-semibold text-color-black">
						{endingInMiliseconds.getDay()}D 
						{endingInMiliseconds.getHours()}H 
						{endingInMiliseconds.getMinutes()}M
					</div>
				</div>
			</div>

			<div class="w-full mt-3 flex flex-row gap-4" on:click>
				<Button gradient rounded stretch>PLACE A BID</Button>
			</div>
		</div>
	</div>
</div>


<style type='postcss'>
	.tab-content {
		-ms-overflow-style: none;  /* Internet Explorer 10+ */
		scrollbar-width: none;  /* Firefox */
	}
	.tab-content::-webkit-scrollbar { 
		display: none;  /* Safari and Chrome */
	}
	
</style>