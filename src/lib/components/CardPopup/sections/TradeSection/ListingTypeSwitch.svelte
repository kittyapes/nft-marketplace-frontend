<script lang="ts">
	import type { ListingType } from '$utils/api/listing';

	export let selectedType: ListingType = 'sale';

	$: console.log(selectedType);
</script>

<div class="flex w-full bg-gradient-to-r from-color-purple to-color-blue h-12 rounded-lg p-[2px]">
	<button class="text-color-purple rounded-l-md" class:selected={selectedType === 'auction'} on:click={() => (selectedType = 'auction')}>Auction</button>
	<button class="text-color-blue rounded-r-md" class:selected={selectedType === 'sale'} on:click={() => (selectedType = 'sale')}>Sale</button>
</div>

<style>
	button {
		@apply w-1/2 font-bold bg-white transition;
	}

	.selected {
		@apply bg-transparent text-white;
	}
</style>
