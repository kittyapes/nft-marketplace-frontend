<script lang="ts">
	import ChevronLeft from '$icons/chevron-left.svelte';
	import ChevronRight from '$icons/chevron-right.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import { createEventDispatcher } from 'svelte';
	import { inview } from 'svelte-inview';

	export let cards: CardOptions[];
	export let isLoading = false;

	const inviewOptions = {};
	const dispatch = createEventDispatcher();
	let cardContainer: HTMLElement;

	$: containerChildWidth = cardContainer?.children[0].clientWidth || 0;

	function handleChevronRight() {
		cardContainer.scrollLeft += containerChildWidth;
	}

	function handleChevronLeft() {
		cardContainer.scrollLeft -= containerChildWidth;
	}

	let observedScrollLeft = 0;

	function handleContainerScroll(ev: Event) {
		observedScrollLeft = cardContainer.scrollLeft;
	}

	function onChange(event) {
		if (event.detail.inView) {
			dispatch('end-reached');
		}
	}

	$: disableChevronLeft = observedScrollLeft === 0;
	$: disableChevronRight = observedScrollLeft >= cardContainer?.scrollWidth - cardContainer?.clientWidth;
</script>

<div class="flex gap-4 w-full overflow-hidden justify-stretch items-stretch">
	{#if !disableChevronLeft}
		<button
			class="w-16 enabled:hover:bg-black enabled:hover:bg-opacity-10 flex-shrink-0 grid place-items-center btn"
			on:click={handleChevronLeft}
			disabled={disableChevronLeft}
			class:!opacity-0={disableChevronLeft}
		>
			<div class="w-4">
				<ChevronLeft />
			</div>
		</button>
	{/if}

	<div class="flex-grow">
		<div class="text-4xl font-semibold text-white mb-12">More from this collection</div>
		<div class="flex flex-grow overflow-x-auto scrollbar-hide snap-mandatory snap-x scroll-smooth gap-4" bind:this={cardContainer} on:scroll={handleContainerScroll}>
			{#each cards as card}
				<div class="snap-start">
					<NftCard options={card} />
				</div>
			{/each}
			{#if isLoading}
				<DiamondsLoader />
			{:else}
				<div use:inview={inviewOptions} on:change={onChange} />
			{/if}
		</div>
	</div>

	{#if !disableChevronRight}
		<button class="w-16 enabled:hover:bg-black enabled:hover:bg-opacity-10 flex-shrink-0 grid place-items-center btn" on:click={handleChevronRight} disabled={disableChevronRight}>
			<div class="w-4">
				<ChevronRight />
			</div>
		</button>
	{/if}
</div>
