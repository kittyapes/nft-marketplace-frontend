<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CardOptions } from '$interfaces/ui';
	import { nftDraft } from '$stores/create';
	import AddCircle from '$icons/add-circle.svelte';
	import { goto } from '$app/navigation';
	import Card from './Card.svelte';
	const dispatch = createEventDispatcher();

	export let options: CardOptions[];
	export let cardPropsMapper: (v: CardOptions) => { options: CardOptions } = (v) => ({ options: v });
	export let isLoading = false;
	export let createNewNftBtn = { include: false, collectionId: '' };
	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';
	export let reachedEnd: boolean;
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
</script>

<div class="w-full text-white">
	{#if !isLoading && options?.length === 0 && !createNewNftBtn.include}
		<div class="placeholder">Nothing to see here, move along.</div>
	{/if}

	{#if options?.length || options?.length === 0}
		<div class:normal-grid={gridStyle === 'normal'} class:dense-grid={gridStyle === 'dense'} class:masonry-container={gridStyle === 'masonry'}>
			{#if createNewNftBtn.include}
				<div
					class="grid place-items-center border border-dashed border-opacity-30 border-color-gray-base clickable hover:scale-105 transition-all rounded-2xl max-w-[246px] min-h-[315px]"
					on:click={() => {
						$nftDraft = {};
						$nftDraft.collectionId = createNewNftBtn.collectionId;
						goto('/create');
					}}
				>
					<div class="flex flex-col items-center justify-center gap-4">
						<button class="rounded-full btn">
							<AddCircle />
						</button>
						<div class="text-color-gray-dark">Create a new NFT</div>
					</div>
				</div>
			{/if}
			{#each options as cardOptions, index (cardOptions.rawResourceData._id)}
				{#if !hidden.get(cardOptions)}
					{@const props = cardPropsMapper(cardOptions)}
					<!-- {#if gridStyle === 'masonry'}
						<img class="w-full h-auto object-center object-cover mb-4 2xl:mb-5" src={props?.options?.nfts?.[0]?.thumbnailUrl} alt={props?.options?.nfts?.[0]?.name} />
					{:else} -->
					<Card options={props?.options} bind:gridStyle />
					<!-- {/if} -->
				{/if}
			{/each}
		</div>
	{/if}
	{#if reachedEnd}
		<div class="text-center placeholder ">You have reached the end of this list.</div>
	{/if}
</div>

<style type="postcss">
	.placeholder {
		@apply p-36 font-semibold text-lg opacity-70;
	}
	.normal-grid {
		@apply grid grid-cols-[repeat(auto-fit,261px)] 2xl:grid-cols-[repeat(auto-fit,324px)];
		@apply justify-between gap-y-10 2xl:gap-y-14;
	}
	.dense-grid {
		@apply grid grid-cols-[repeat(auto-fit,166px)] 2xl:grid-cols-[repeat(auto-fit,206px)];
		@apply justify-between gap-y-8 2xl:gap-y-10;
	}
	.masonry-container {
		@apply columns-[166px] 2xl:columns-[206px];
		@apply gap-x-5 2xl:gap-x-6;
	}
</style>
