<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import PriceInput from '$lib/components/PriceInput.svelte';
	import OffersLoader from '$lib/components/functional/OffersLoader/OffersLoader.svelte';
	import ButtonSpinner from '$lib/components/v2/ButtonSpinner/ButtonSpinner.svelte';
	import OfferList from '$lib/components/v2/OfferList/OfferList.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { appSigner, currentUserAddress } from '$stores/wallet';
	import { apiCancelOffer, apiSubmitOffer } from '$utils/api/offers';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { BigNumber } from 'ethers';
	import { parseEther } from 'ethers/lib/utils';
	import { get } from 'svelte/store';

	export let options: CardOptions;

	// In case someone is wondering why an offer doesn't work on an NFT that was once sold
	// and not bought back by the creator, here you have your answer. Apparently we are not
	// able to reliable get the current NFT's owner address.
	$: ownerAddress =
		options.resourceType === 'listing' ? options.rawListingData.seller : options.nfts[0].creator;

	let offerAmountFloat: string;

	let isMakingOffer = false;

	async function handleMakeOffer() {
		isMakingOffer = true;

		const offerAmountBigNumber = parseEther(offerAmountFloat);

		let res: Awaited<ReturnType<typeof apiSubmitOffer>>;

		try {
			res = await apiSubmitOffer(
				get(appSigner),
				options.nfts[0].contractAddress,
				BigNumber.from(options.nfts[0].onChainId), // TODO replace with .fullId, this is only a hotfix
				offerAmountBigNumber,
			);
		} catch (ex) {
			console.error(ex);
			notifyError('Failed making offer!');

			isMakingOffer = false;
			return;
		}

		notifySuccess('Placed offer.');

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
			nftFullId={options.nfts[0].onChainId}
		>
			<!-- The above onChainId is a hotfix, needs to be replaced with fullId -->
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

	<div class="grid grid-cols-2 gap-2">
		<PrimaryButton on:click={handleCancelOffer} disabled={isCancellingOffer || !hasUserPlacedOffer}>
			{#if isCancellingOffer}
				<ButtonSpinner />
			{/if}

			Cancel Offer
		</PrimaryButton>

		<PrimaryButton on:click={handleMakeOffer} disabled={isMakingOffer || !offerAmountFloat}>
			{#if isMakingOffer}
				<ButtonSpinner />
			{/if}

			Make Offer
		</PrimaryButton>
	</div>
</div>
