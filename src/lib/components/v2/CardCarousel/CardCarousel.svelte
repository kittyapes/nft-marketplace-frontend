<script lang="ts">
	import ChevronLeft from '$icons/chevron-left.svelte';
	import ChevronRight from '$icons/chevron-right.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import NftCard from '$lib/components/NftCard.svelte';

	export let cards: CardOptions[];

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

	$: disableChevronLeft = observedScrollLeft === 0;
	$: disableChevronRight = observedScrollLeft >= cardContainer?.scrollWidth - cardContainer?.clientWidth;
</script>

<div class="flex gap-4 w-full overflow-hidden justify-stretch items-stretch">
	<button class="w-16 enabled:hover:bg-black enabled:hover:bg-opacity-10 flex-shrink-0 grid place-items-center btn" on:click={handleChevronLeft} disabled={disableChevronLeft}>
		<ChevronLeft />
	</button>

	<div class="flex flex-grow overflow-x-auto scrollbar-hide snap-mandatory snap-x scroll-smooth gap-4" bind:this={cardContainer} on:scroll={handleContainerScroll}>
		{#each cards as card}
			<div class="snap-start">
				<NftCard options={card} />
			</div>
		{/each}
	</div>

	<button class="w-16 enabled:hover:bg-black enabled:hover:bg-opacity-10 flex-shrink-0 grid place-items-center btn" on:click={handleChevronRight} disabled={disableChevronRight}>
		<ChevronRight />
	</button>
</div>
