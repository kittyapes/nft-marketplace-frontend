<script lang="ts">
	import type { OfferModel } from '$interfaces';
	import OfferRow from '../OfferRow/OfferRow.svelte';
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';

	export let data: OfferModel[] = [];
	export let isLoading: boolean;
</script>

<div class="border p-4 overflow-y-scroll scrollbar-hide h-full" data-simplebar>
	{#each data as row}
		<OfferRow data={row} />
	{:else}
		<div class="font-semibold">
			{#if isLoading}
				Loading offers...
			{:else}
				No offers to show.
			{/if}
		</div>
	{/each}
</div>
