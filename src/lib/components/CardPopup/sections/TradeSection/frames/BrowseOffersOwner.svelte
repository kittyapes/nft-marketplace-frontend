<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';
	import OffersLoader from '$lib/components/functional/OffersLoader/OffersLoader.svelte';
	import OfferList from '$lib/components/v2/OfferList/OfferList.svelte';

	export let options: CardOptions;
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
			nftFullId={options.nfts[0].onChainId}
		>
			<!-- The above onChainId is a hotfix, needs to be replaced with fullId -->
			<OfferList
				userIsOwner
				currentUserOffer={null}
				data={offers}
				{isLoading}
				endReached={isEndReached}
				errLoading={isError}
				on:end-of-scroll={onEndReached}
			/>
		</OffersLoader>
	</div>
</div>
