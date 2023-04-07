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

	export let offerOfCurrentUser: OfferModel | null;
	export let data: OfferModel[] = [];
	export let isLoading: boolean;
	export let endReached: boolean;
	export let errLoading: boolean;

	onMount(async () => {
		await tick();

		const selector = '.' + uniqClass + '[data-simplebar]';
		const instance = SimpleBar.instances.get(document.querySelector(selector));

		onEndOfScroll(instance.getScrollElement(), () => dispatch('end-of-scroll'));
	});
</script>

<div class="relative overflow-hidden h-full">
	<div
		class="border overflow-y-scroll scrollbar-hide flex-grow h-full {uniqClass} relative"
		data-simplebar
	>
		<div class="p-4 pb-8">
			<!-- Display offer of current user separately, at the top -->
			{#if offerOfCurrentUser}
				<OfferRow isFromCurrentUser data={offerOfCurrentUser} />
			{/if}

			{#each data as row}
				<OfferRow data={row} />
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

			{#if endReached}
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
