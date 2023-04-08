<script lang="ts">
	import OffersLoader from '$lib/components/functional/OffersLoader/OffersLoader.svelte';
	import OfferList from '$lib/components/v2/OfferList/OfferList.svelte';
</script>

<div class="overflow-hidden aspect-1 flex flex-col">
	<div class="text-white text-lg font-medium mb-2 flex-shrink-0">Offers</div>

	<div class="flex-grow overflow-hidden">
		<OffersLoader let:isLoading let:isError let:isEndReached let:offers let:onEndReached>
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
