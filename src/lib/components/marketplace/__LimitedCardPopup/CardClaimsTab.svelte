<script lang="ts">
	import { fade } from 'svelte/transition';
	import CardBidsRow from './CardClaimsRow.svelte';
	import Button from '$lib/components/Button.svelte';

	export let rowInfo: PopupRowInfo[] = Array(20).fill(0).map((_, i) => ({id: i, message: '30 min', nickname: 'Mitchell', imageUrl: ''} as PopupRowInfo))
	export let owners = rowInfo.length;
	export let endingIn = new Date();
	export let nftCost: number = 500;

</script>

<div class="w-full h-full flex flex-col" in:fade={{ duration: 300 }}>
	<div class="flex-grow h-auto flex-shrink overflow-y-scroll tab-content">
		{#each rowInfo as row}
			<CardBidsRow {row}/>
		{/each}
	</div>
	<div class="w-full bottom-0 flex-shrink">
		<div>
			<div class="w-full border-t border-color-black border-opacity-30 flex">
				<div class="w-1/2 border-r border-color-black border-opacity-30 pt-2">
					<div class="text-sm text-color-black opacity-70 ">Owners</div>
					<div class="text-2xl font-semibold text-color-black"> {owners}</div>
				</div>

				<div class="w-1/2 pt-2 pl-4">
					<div class="text-sm text-color-black opacity-70 ">Ending in</div>
					<div class="text-2xl font-semibold text-color-black">
						{endingIn.getUTCDate() - 1}D 
						{endingIn.getUTCHours()}H
						{endingIn.getUTCMinutes()}M
					</div>
				</div>
			</div>

			<div class="w-full mt-3 flex flex-row gap-4" on:click>
				<Button gradient rounded stretch>BUY FOR {nftCost} HI</Button>
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