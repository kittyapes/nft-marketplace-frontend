<script lang="ts">
	import { onMount } from 'svelte';
	import { apiGetOffers } from '$utils/api/offers';
	import { notifyError } from '$utils/toast';
	import type { OfferModel } from '$interfaces';
	import { currentUserAddress } from '$stores/wallet';
	import { get } from 'svelte/store';

	const limit = 10;

	export let nftFullId: string;

	let isLoading = false;
	let pageIndex = 1;
	let isError = false;
	let isEndReached = false;
	let currentUserOffer: OfferModel = null;
	let offers: OfferModel[] = [];

	export async function reloadOffers() {
		offers = [];
		pageIndex = 1;

		loadOffers();
	}

	async function loadOffers() {
		isLoading = true;

		let newOffers: OfferModel[] = [];

		try {
			newOffers = await apiGetOffers(pageIndex, limit, nftFullId);
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

			currentUserOffer = offers.find(
				(offer: OfferModel) => offer.user.address === get(currentUserAddress),
			);

			if (newOffers.length < limit) {
				isEndReached = true;
			}
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
