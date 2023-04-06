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

	async function loadOffers() {
		isLoadingOffers = true;

		try {
			offers = await apiGetOffers();
		} catch (ex) {
			console.error(ex);
			notifyError('Failed to load offers.');
		}

		isLoadingOffers = false;
	}

	onMount(() => {
		loadOffers();
	});
</script>

<div class="overflow-hidden aspect-1 flex flex-col">
	<div class="text-white text-lg font-medium mb-2">Offers</div>

	<div class="flex-grow">
		<OfferList data={offers} isLoading={isLoadingOffers} />
	</div>

	<div class="mt-4 mb-4">
		<PriceInput
			tokenLabel="wETH"
			tokenIconClass={Eth}
			placeholder="Input Price"
			bind:value={offerAmountFloat}
		/>
	</div>

	<PrimaryButton on:click={handleMakeOffer} disabled={isMakingOffer || !offerAmountFloat}>
		{#if isMakingOffer}
			<ButtonSpinner />
		{/if}

		Make Offer
	</PrimaryButton>
</div>
