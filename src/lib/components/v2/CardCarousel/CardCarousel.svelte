<script lang="ts">
	import ChevronLeft from '$icons/chevron-left.svelte';
	import ChevronRight from '$icons/chevron-right.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import NftCard from '$lib/components/NftCard.svelte';
	import { createEventDispatcher, tick } from 'svelte';
	import { inview } from 'svelte-inview';

	export let cards: CardOptions[];
	export let isLoading = false;

	const inviewOptions = {};
	const dispatch = createEventDispatcher();

	let cardContainer: HTMLElement;
	let cardContainerW: number;

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

	// React to content changes by hiding and revealing scroll arrows
	async function updateArrows() {
		showArrows = false;

		await tick();

		if (cardContainer.scrollWidth > cardContainer.clientWidth) {
			showArrows = true;
		}
	}

	let showArrows = false;

	$: if (cardContainer) {
		cards, cardContainerW;

		updateArrows();
	}
</script>

<div class="grid grid-cols-10 gap-4 w-full overflow-hidden justify-stretch items-stretch">
	{#if showArrows}
		<button class="enabled:hover:bg-black enabled:hover:bg-opacity-10 flex-shrink-0 grid place-items-center btn" on:click={handleChevronLeft} disabled={disableChevronLeft}>
			<div class="w-4">
				<ChevronLeft />
			</div>
		</button>
	{/if}

	<div class="h-full flex flex-col" class:col-span-8={showArrows} class:col-span-10={!showArrows}>
		<div class="text-4xl font-semibold text-white mb-12">More from this collection</div>
		<div
			class="flex flex-grow overflow-x-auto snap-mandatory snap-x scroll-smooth gap-4 w-full scrollbar-hide"
			bind:this={cardContainer}
			bind:clientWidth={cardContainerW}
			on:scroll={handleContainerScroll}
		>
			{#each cards as card}
				<div class="snap-start h-full w-72 flex-shrink-0">
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

	{#if showArrows}
		<button class="enabled:hover:bg-black enabled:hover:bg-opacity-10 flex-shrink-0 grid place-items-center btn" on:click={handleChevronRight} disabled={disableChevronRight}>
			<div class="w-4">
				<ChevronRight />
			</div>
		</button>
	{/if}
</div>
