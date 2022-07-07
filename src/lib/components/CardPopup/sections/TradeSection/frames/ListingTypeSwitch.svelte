<script lang="ts">
	import type { ListingType } from '$utils/api/listing';

	export let selectedType: ListingType = 'sale';
	export let disabled = false;
</script>

<div class="flex w-full bg-gradient-to-r from-color-purple to-color-blue h-12 rounded-lg p-[2px]" class:opacity-50={disabled}>
	<button class="text-color-purple rounded-l-md" class:selected={selectedType === 'auction'} on:click={() => (selectedType = 'auction')} {disabled}>Auction</button>
	<button class="text-color-blue rounded-r-md" class:selected={selectedType === 'sale'} on:click={() => (selectedType = 'sale')} {disabled}>Sale</button>
</div>

<style type="postcss">
	button {
		@apply w-1/2 font-bold bg-white transition;
	}

	.selected {
		@apply bg-transparent text-white;
	}
</style>
