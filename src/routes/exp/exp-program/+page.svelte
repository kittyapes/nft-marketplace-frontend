<script>
	import { goto } from '$app/navigation';
	import EthV2 from '$icons/eth-v2.svelte';
	import HinataGlow from '$icons/HinataGlow.svelte';
	import InteractableInfo from '$lib/components/v2/InteractableInfo/InteractableInfo.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';
	import { tier_1, tier_2, tier_3 } from '..';
	import CollectionList from '../lib/CollectionList.svelte';
	import RewardsHeader from '../lib/RewardsHeader.svelte';
</script>

<main class="text-white">
	<RewardsHeader />

	<h3
		class="underline text-2xl font-mediu text-center mt-8 font-bold flex items-center gap-x-2 justify-center"
	>
		Trading Volume

		<InteractableInfo>
			Normal users receive 1 EXP point for every 0.005 Eth trading volume they are a part of.
		</InteractableInfo>
	</h3>

	<div class="font-semibold text-xl mt-1 flex items-center justify-center">
		Every .005
		<div class="mx-2">
			<EthV2 />
		</div>
		traded =
		<span class="text-effect-orange ml-2">1 EXP point</span>

		<div class="ml-2">
			<HinataGlow />
		</div>
	</div>

	<h3 class="underline text-2xl font-mediu text-center mt-8 font-semibold">EXP for Listing NFTs</h3>

	<div class="grid grid-cols-3 gradient-border mt-12">
		<div class="pl-2 md:pl-8 lg:pl-20 py-4 table-border border-b-2 table-border border-r-2">
			<div class="flex items-center gap-2">
				<span class="text-shadow-purple font-medium text-lg">Tier 1</span>
				<span class="text-effect-purple text-lg">( 50 EXP )</span>

				<InteractableInfo>
					By listing NFTs from this collection you will receive 50 EXP points.
				</InteractableInfo>
			</div>
		</div>

		<div class="pl-2 md:pl-8 lg:pl-20 py-4 table-border border-b-2 table-border border-r-2">
			<div class="flex items-center gap-2">
				<span class="text-shadow-blue font-medium text-lg">Tier 2</span>
				<span class="text-effect-blue text-lg">( 30 EXP )</span>

				<InteractableInfo>
					By listing NFTs from this collection you will receive 30 EXP points.
				</InteractableInfo>
			</div>
		</div>

		<div class="pl-2 md:pl-8 lg:pl-20 py-4 table-border border-b-2">
			<div class="flex items-center gap-2">
				<span class="text-shadow-green font-medium text-lg">Tier 3</span>
				<span class="text-effect-green text-lg">( 10 EXP )</span>

				<InteractableInfo>
					By listing NFTs from this collection you will receive 10 EXP points.
				</InteractableInfo>
			</div>
		</div>

		<div class="table-border border-r-2">
			<CollectionList collections={tier_1} />
		</div>

		<div class="table-border border-r-2">
			<CollectionList collections={tier_2} />
		</div>

		<div>
			<CollectionList collections={tier_3} />
		</div>
	</div>

	<div class="mx-auto grid place-items-center mt-12">
		<h2 class="text-gradient text-4xl font-medium">Verified Creators</h2>
	</div>

	<p class="text-center max-w-prose mx-auto mt-4">
		What is a verified creator? A verified creator is a user that applied to on the marketplace to
		receive a verified creator role allowing them to create collections and NFTs on Hinata
		Marketplace.
	</p>

	<!-- <div class="mt-12 max-w-screen-sm mx-auto">
		<PrimaryButton on:click={() => goto('/apply-for-verified-creator')}>
			Apply to be a Verified Creator
		</PrimaryButton>
	</div> -->

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-y-16 mt-16 mb-32">
		<div class="text-lg uppercase font-semibold text-center">
			<div class="flex items-center gap-2 justify-center">
				Verified Creator Mints
				<InteractableInfo>
					By minting NFTs on Hinata as a verified creator you will receive 100 EXP points.
				</InteractableInfo>
			</div>
			<div class="text-sm font-semibold opacity-0 select-none">Consistent padding :)</div>
			<div class="text-effect-blue lg:mt-6">(Coming Soon)</div>
		</div>

		<div class="flex flex-col items-center">
			<div class="uppercase text-lg font-semibold flex items-center justify-center gap-2">
				Verified Creator Sales
				<InteractableInfo>
					Verified creators receive 1 EXP point for every 0.001 ETH of trading volume they are a
					part of.
				</InteractableInfo>
			</div>
			<div class="text-sm">(For NFTs created on Hinata)</div>

			<div class="font-semibold text-xl flex items-center justify-center mt-4 lg:mt-6">
				Every .001
				<div class="mx-2">
					<EthV2 />
				</div>
				traded =
				<span class="text-effect-orange ml-2">1 EXP</span>
			</div>
		</div>

		<div class="flex flex-col items-center text-center">
			<div class="uppercase text-lg font-semibold flex items-center justify-center gap-2">
				Verified Creator Listing
				<InteractableInfo>
					Once every 24 hours verified creators receive 50 EXP points for listing any NFT created on
					Hinata Marketplace.
				</InteractableInfo>
			</div>
			<div class="text-sm">(For NFTs created on Hinata 1 Every 24 Hours)</div>

			<div class="text-effect-blue font-semibold text-lg mt-4 lg:mt-6">50 EXP</div>
		</div>
	</div>
</main>

<style lang="postcss">
	.table-border {
		@apply border-color-blue border-opacity-50;
	}
</style>
