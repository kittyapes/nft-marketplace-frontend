<script>
	import { fade } from 'svelte/transition';
	import CardHistoryRow from './CardHistoryRow.svelte';
	import Button from '../Button.svelte';
</script>

<div class="w-full h-full flex flex-col" in:fade={{ duration: 300 }}>
	<div class="flex-grow h-auto flex-shrink overflow-y-scroll">
		{#each Array(20).fill(0) as el, i}
			<CardHistoryRow idx={i} />
		{/each}
	</div>
	<div class="w-full bottom-0 flex-shrink">
		<div>
			<div class="w-full border-t border-color-black border-opacity-30 flex">
				<div class="w-1/2 border-r border-color-black border-opacity-30 pt-2">
					<div class="text-sm text-color-black opacity-70 ">Traded Volume</div>
					<div class="text-2xl">3 Ξ</div>
				</div>

				<div class="w-1/2  pt-2 pl-4">
					<div class="text-sm text-color-black opacity-70 ">Transactions</div>
					<div class="text-2xl">5</div>
				</div>
			</div>

			<div class="w-full mt-3 flex flex-row p-2">
				<Button rounded gradient stretch>view blockchain data</Button>
			</div>
		</div>
	</div>
</div>
