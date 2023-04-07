<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { OfferModel } from '$interfaces';
	import PriceInput from '$lib/components/PriceInput.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import OfferList from '$lib/components/v2/OfferList/OfferList.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { apiGetOffers, apiMakeOffer } from '$utils/api/offers';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { parseEther } from 'ethers/lib/utils';
	import { onMount } from 'svelte';

	let offers: OfferModel[] = [];
	let offerAmountFloat: string;

	let isMakingOffer = false;

	async function handleMakeOffer() {
		isMakingOffer = true;

		const offerAmountBigNumber = parseEther(offerAmountFloat);

		let res: Awaited<ReturnType<typeof apiMakeOffer>>;

		try {
			res = await apiMakeOffer($currentUserAddress, offerAmountBigNumber);
		} catch (ex) {
			console.error(ex);
			notifyError('Failed making offer!');

			isMakingOffer = false;
			return;
		}

		notifySuccess('Placed offer.');

		isMakingOffer = false;
	}

	let isLoadingOffers = false;
	let nextOffersPageIndex = 1;
	let errLoadingOffers = false;
	let offersEndReached = false;
	let offerOfCurrentUser: OfferModel;

	async function loadOffers() {
		isLoadingOffers = true;

		let newOffers: OfferModel[] = [];

		try {
			newOffers = await apiGetOffers(nextOffersPageIndex, 10);
		} catch (ex) {
			errLoadingOffers = true;
			isLoadingOffers = false;

			console.error(ex);
			notifyError('Failed to load offers.');

			return;
		}

		if (newOffers.length) {
			nextOffersPageIndex++;
			offers = [...offers, ...newOffers];

			// This is temporary
			offerOfCurrentUser = newOffers[0];
		} else {
			offersEndReached = true;
		}

		isLoadingOffers = false;
	}

	async function handleEndOfScroll() {
		if (!offersEndReached && !isLoadingOffers) {
			await loadOffers();
		}
	}

	let hasUserPlacedOffer = false;

	onMount(() => {
		loadOffers();
	});
</script>

<div class="overflow-hidden aspect-1 flex flex-col">
	<div class="text-white text-lg font-medium mb-2 flex-shrink-0">Offers</div>

	<div class="flex-grow overflow-hidden">
		<OfferList
			{offerOfCurrentUser}
			data={offers}
			isLoading={isLoadingOffers}
			endReached={offersEndReached}
			errLoading={errLoadingOffers}
			on:end-of-scroll={handleEndOfScroll}
		/>
	</div>

	<div class="mt-4 mb-4 flex-shrink-0">
		<PriceInput
			tokenLabel="wETH"
			tokenIconClass={Eth}
			placeholder="Input Price"
			bind:value={offerAmountFloat}
		/>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<PrimaryButton disabled={!hasUserPlacedOffer}>Cancel Offer</PrimaryButton>

		<PrimaryButton on:click={handleMakeOffer} disabled={isMakingOffer || !offerAmountFloat}>
			{#if isMakingOffer}
				<ButtonSpinner />
			{/if}

			Make Offer
		</PrimaryButton>
	</div>
</div>
