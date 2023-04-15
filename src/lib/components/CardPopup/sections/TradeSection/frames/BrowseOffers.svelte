<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import PriceInput from '$lib/components/PriceInput.svelte';
	import OffersLoader from '$lib/components/functional/OffersLoader/OffersLoader.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import OfferList from '$lib/components/v2/OfferList/OfferList.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import { HandledError } from '$utils';
	import { apiCancelOffer, apiSubmitOffer } from '$utils/api/offers';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { parseEther } from 'ethers/lib/utils';
	import { get } from 'svelte/store';

	export let options: CardOptions;

	let offerAmountFloat: string;

	let isMakingOffer = false;
	let reloadOffers: () => any;

	async function handleMakeOffer() {
		isMakingOffer = true;

		const offerAmountBigNumber = parseEther(offerAmountFloat);

		let res: Awaited<ReturnType<typeof apiSubmitOffer>>;

		try {
			res = await apiSubmitOffer(get(appSigner), options.nfts[0].fullId, offerAmountBigNumber);
		} catch (err) {
			if (err instanceof HandledError) {
				return;
			}

			console.error(err);
			notifyError('Failed making offer!');

			return;
		} finally {
			isMakingOffer = false;
		}

		notifySuccess('Placed offer.');
		offerAmountFloat = '';
		reloadOffers();

		isMakingOffer = false;
	}

	let hasUserPlacedOffer = false;
	let isCancellingOffer = false;

	async function handleCancelOffer() {
		isCancellingOffer = true;

		let res: Awaited<ReturnType<typeof apiCancelOffer>>;

		try {
			res = await apiCancelOffer($currentUserAddress);
		} catch (ex) {
			console.error(ex);
			notifyError('Sorry, failed to cancel your offer!');

			isMakingOffer = false;
			return;
		}

		notifySuccess('Cancelled your offer.');

		isCancellingOffer = false;
		hasUserPlacedOffer = false;
	}
</script>

<div class="overflow-hidden aspect-1 flex flex-col">
	<div class="text-white text-lg font-medium mb-2 flex-shrink-0">Offers</div>

	<div class="flex-grow overflow-hidden">
		<OffersLoader
			let:isLoading
			let:isError
			let:isEndReached
			let:offers
			let:onEndReached
			let:currentUserOffer
			nftFullId={options.nfts[0].fullId}
			bind:reloadOffers
		>
			<OfferList
				userIsOwner={false}
				{currentUserOffer}
				data={offers}
				{isLoading}
				endReached={isEndReached}
				errLoading={isError}
				on:end-of-scroll={onEndReached}
			/>
		</OffersLoader>
	</div>

	<div class="mt-4 mb-4 flex-shrink-0">
		<PriceInput
			tokenLabel="wETH"
			tokenIconClass={Eth}
			placeholder="Input Price"
			bind:value={offerAmountFloat}
		/>
	</div>

	<div class="grid grid-cols-1 gap-2">
		<!-- <PrimaryButton on:click={handleCancelOffer} disabled={isCancellingOffer || !hasUserPlacedOffer}>
			{#if isCancellingOffer}
				<ButtonSpinner />
			{/if}

			Cancel Offer
		</PrimaryButton> -->

		<PrimaryButton on:click={handleMakeOffer} disabled={isMakingOffer || !offerAmountFloat}>
			{#if isMakingOffer}
				<ButtonSpinner />
			{/if}

			Make Offer
		</PrimaryButton>
	</div>
</div>
