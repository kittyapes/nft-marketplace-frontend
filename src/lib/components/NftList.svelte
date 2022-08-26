<script lang="ts">
	import NftCard from './NftCard.svelte';
	import DiamondsLoader from './DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';
	import { createEventDispatcher } from 'svelte';
	import type { CardOptions } from '$interfaces/ui';

	const dispatch = createEventDispatcher();

	export let options: CardOptions[];
	export let cardPropsMapper: (v: CardOptions) => { options: CardOptions } = (v) => ({ options: v });
	export let isLoading = false;
	export let reachedEnd = false;

	const inviewOptions = {};

	function onChange(event) {
		if (event.detail.inView) {
			dispatch('end-reached');
		}
	}

	function hideCard(index) {
		options.splice(index, 1);
		options = options;
	}

	let hidden = new WeakMap();

	$: options.forEach((o) =>
		o.staleResource.subscribe((r) => {
			if (r?.reason === 'cancelled') {
				hidden.set(o, true);
				hidden = hidden;
			}
		}),
	);
</script>

<div class="w-full">
	{#if !isLoading && options?.length === 0}
		<div class="placeholder">Nothing to see here, move along.</div>
	{/if}

	{#if options?.length}
		<div class="nftGrid">
			{#each options as cardOptions, index (cardOptions.rawResourceData._id)}
				{#if !hidden.get(cardOptions)}
					{@const props = cardPropsMapper(cardOptions)}
					<NftCard {...props} on:hide-me={() => hideCard(index)} />
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
		<div class="text-center placeholder">You have reached the end of this list.</div>
	{/if}
</div>

<style type="postcss">
	.placeholder {
		@apply p-36 font-semibold text-lg opacity-60;
	}

	.nftGrid {
		@apply grid min-w-full gap-3 p-2 my-5 mx-auto;
		grid-template-columns: repeat(auto-fit, 215px);
	}
</style>
