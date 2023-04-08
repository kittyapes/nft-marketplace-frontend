<script lang="ts">
	import { onMount } from 'svelte';
	import { apiGetOffers } from '$utils/api/offers';
	import { notifyError } from '$utils/toast';
	import type { OfferModel } from '$interfaces';

	export let nftFullId: string;

	let isLoading = false;
	let pageIndex = 1;
	let isError = false;
	let isEndReached = false;
	let currentUserOffer: OfferModel = null;
	let offers: OfferModel[] = [];

	async function loadOffers() {
		isLoading = true;

		let newOffers: OfferModel[] = [];

		try {
			newOffers = await apiGetOffers(pageIndex, 10, nftFullId);
		} catch (ex) {
			isError = true;
			isLoading = false;

			console.error(ex);
			notifyError('Failed to load offers.');

			return;
		}

		if (newOffers.length) {
			pageIndex++;
			offers = [...offers, ...newOffers];

			// This is temporary
			currentUserOffer = newOffers[0];
		} else {
			isEndReached = true;
		}

		isLoading = false;
	}

	async function onEndReached() {
		if (!isEndReached && !isLoading) {
			await loadOffers();

			return true;
		}

		return false;
	}

	onMount(() => {
		loadOffers();
	});
</script>

<slot {isLoading} {pageIndex} {isError} {isEndReached} {currentUserOffer} {offers} {onEndReached} />
