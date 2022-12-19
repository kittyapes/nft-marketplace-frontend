<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CardOptions } from '$interfaces/ui';
	import NftCard from '$lib/components/NftCard.svelte';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import CreateNewNftBtn from './CreateNewNftBtn.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions[];
	export let cardPropsMapper: (v: CardOptions) => { options: CardOptions } = (v) => ({ options: v });
	export let isLoading = false;
	export let createNewNftBtn = '';
	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';
	export let reachedEnd = false;

	let hidden = new WeakMap();

	$: options.forEach((o) =>
		o.staleResource.subscribe((r) => {
			if (r?.reason === 'cancelled') {
				hidden.set(o, true);
				hidden = hidden;
				dispatch('refresh-tabs', {
					tabs: ['collected', 'created'],
				});
			}
		}),
	);

	function hideCard(index) {
		options.splice(index, 1);
		options = options;
		dispatch('refresh-tabs', {
			tabs: ['collected', 'created', 'hidden'],
		});
	}
</script>

<div class="w-full text-white">
	{#if !isLoading && options?.length === 0 && !createNewNftBtn}
		<div class="placeholder">Nothing to see here, move along.</div>
	{/if}

	{#if options?.length || options?.length === 0}
		<div class:normal-grid={gridStyle === 'normal'} class:dense-grid={gridStyle === 'dense'} class:masonry-container={gridStyle === 'masonry'}>
			{#if createNewNftBtn && !isLoading}
				<CreateNewNftBtn collectionId={createNewNftBtn} />
			{/if}

			{#each options as cardOptions, index (cardOptions.rawResourceData._id)}
				{#if !hidden.get(cardOptions)}
					{@const props = cardPropsMapper(cardOptions)}
					<NftCard {...props} on:hide-me={() => hideCard(index)} bind:gridStyle />
				{/if}
			{/each}
		</div>
	{/if}

	{#if isLoading}
		<DiamondsLoader />
	{:else if reachedEnd && options?.length > 0}
		<div class="text-center placeholder ">You have reached the end of this list.</div>
	{/if}
</div>

<style type="postcss">
	.placeholder {
		@apply p-36 font-semibold text-lg opacity-70;
	}
	.normal-grid {
		@apply grid grid-cols-[repeat(auto-fit,345px)];
		@apply justify-between gap-y-14;
	}
	.dense-grid {
		@apply grid grid-cols-[repeat(auto-fit,260px)];
		@apply justify-between gap-y-10;
	}
	.masonry-container {
		@apply columns-[260px];
		@apply gap-x-6;
	}
</style>
