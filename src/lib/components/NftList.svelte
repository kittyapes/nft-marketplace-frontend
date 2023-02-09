<script lang="ts">
	import NftCard from './NftCard.svelte';
	import DiamondsLoader from './DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';
	import { createEventDispatcher } from 'svelte';
	import type { CardOptions } from '$interfaces/ui';
	import { nftDraft } from '$stores/create';
	import AddCircle from '$icons/add-circle.svelte';
	import { goto } from '$app/navigation';
	import CreateNftBtn from './CreateNftBtn.svelte';

	const dispatch = createEventDispatcher();

	export let options: CardOptions[];
	export let cardPropsMapper: (v: CardOptions) => { options: CardOptions } = (v) => ({ options: v });
	export let isLoading = false;
	export let reachedEnd = false;
	export let createNewNftBtn = { include: false, collectionId: '' };

	const inviewOptions = {};

	function onChange(event) {
		if (event.detail.inView) {
			dispatch('end-reached');
		}
	}

	function hideCard(index) {
		options.splice(index, 1);
		options = options;
		dispatch('refresh-tabs', {
			tabs: ['collected', 'created', 'hidden'],
		});
	}

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
		<div class="nftGrid">
			{#if createNewNftBtn.include}
				<CreateNftBtn collectionId={createNewNftBtn.collectionId} />
			{/if}
			{#each options as cardOptions, index (cardOptions.localId)}
				{#if !hidden.get(cardOptions)}
					{@const props = cardPropsMapper(cardOptions)}
					<NftCard {...props} on:hide-me={() => hideCard(index)} on:refresh-tabs />
				{/if}
			{/each}
		</div>
	{/if}

	{#if isLoading}
		<DiamondsLoader />
	{:else}
		<div use:inview={inviewOptions} on:change={onChange} />
	{/if}
	{#if reachedEnd && options?.length !== 0}
		<div class="text-center placeholder ">You have reached the end of this list.</div>
	{/if}
</div>

<style type="postcss">
	.placeholder {
		@apply p-36 font-semibold text-lg opacity-70;
	}

	.nftGrid {
		@apply min-w-full my-5 mx-auto grid grid-cols-[repeat(auto-fill,minmax(345px,1fr))] gap-4;
	}
</style>
