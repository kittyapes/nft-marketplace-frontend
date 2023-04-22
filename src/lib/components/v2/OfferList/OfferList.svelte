<script lang="ts">
	import { onEndOfScroll } from '$actions/onEndOfScroll';
	import type { OfferModel } from '$interfaces';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import OfferRow from '../OfferRow/OfferRow.svelte';
	import SimpleBar from 'simplebar';
	import 'simplebar/dist/simplebar.css';
	import { slide } from 'svelte/transition';

	const dispatch = createEventDispatcher();
	const uniqClass = 'uniq-' + Math.random().toString().slice(2);

	export let userIsOwner: boolean;
	export let currentUserOffer: OfferModel | null;
	export let data: OfferModel[] = [];
	export let isLoading: boolean;
	export let endReached: boolean;
	export let errLoading: boolean;
	export let dedupeCurrentUserOffer: boolean = true;

	function filterData(data: OfferModel[]): OfferModel[] {
		if (dedupeCurrentUserOffer) {
			data = data.filter((offer: OfferModel) => offer != currentUserOffer);
		}

		return data;
	}

	$: filteredData = filterData(data);

	// If data is updated and the content does not overflow the scroll element,
	// simulate an overflow to load more data, that way it doesn't stop loading
	// data because the page size is set to too low value
	let scrollElement: HTMLElement;

	async function mockEndOfScroll() {
		await tick();

		if (scrollElement.scrollHeight === scrollElement.clientHeight) {
			dispatch('end-of-scroll');
		}
	}

	$: data, scrollElement && mockEndOfScroll();

	onMount(async () => {
		await tick();

		const selector = '.' + uniqClass + '[data-simplebar]';
		const instance = SimpleBar.instances.get(document.querySelector(selector));

		scrollElement = instance.getScrollElement();

		onEndOfScroll(scrollElement, () => dispatch('end-of-scroll'));
	});
</script>

<div class="relative overflow-hidden h-full">
	<div
		class="border overflow-y-scroll scrollbar-hide flex-grow h-full {uniqClass} relative"
		data-simplebar
	>
		<div class="p-4 pb-8">
			<!-- Display offer of current user separately, at the top -->
			{#if currentUserOffer}
				<OfferRow isFromCurrentUser data={currentUserOffer} enableHover={false} />
			{/if}

			{#each filteredData as row}
				<OfferRow data={row} enableHover={userIsOwner} />
			{:else}
				<div class="font-medium text-white text-center opacity-50">
					{#if isLoading}
						Loading offers...
					{:else if !errLoading}
						No offers to show.
					{/if}
				</div>
			{/each}

			{#if errLoading}
				<div class="font-medium text-white text-center opacity-50 mt-12">
					Sorry, an error has occured during loading the offer list.
				</div>
			{/if}

			{#if endReached && data.length}
				<div class="font-medium text-white text-center opacity-50 mt-12 mb-4">
					You have reached the end of the offer list.
				</div>
			{/if}
		</div>
	</div>

	{#if isLoading}
		<div
			class="absolute bottom-0 left-0 w-full px-4 pt-3 pb-2 text-xs font-semibold rounded-t-sm text-white"
			transition:slide|local
		>
			Loading more offers...
		</div>
	{/if}
</div>
