<script lang="ts">
	import type { ListingType } from '$utils/api/listing';

	export let selectedType: ListingType = 'sale';
	export let disabled = false;
</script>

<div class="w-full bg-gradient-to-r from-color-purple to-color-blue h-12 p-[2px]" class:opacity-50={disabled}>
	<div class="flex w-full h-full bg-dark-gradient">
		<button class="" class:selected={selectedType === 'auction'} on:click={() => (selectedType = 'auction')} {disabled}>Auction</button>
		<button class="" class:selected={selectedType === 'sale'} on:click={() => (selectedType = 'sale')} {disabled}>Sale</button>
	</div>
</div>

<style lang="postcss">
	button {
		@apply w-1/2 font-bold transition relative;
		background: radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
	}

	.selected {
		@apply bg-gradient-to-r from-color-purple to-color-blue;
	}
</style>
