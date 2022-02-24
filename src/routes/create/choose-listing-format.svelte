<script>
	import { setPopup } from '$utils/popup';
	import CardButton from '$lib/components/create/CardButton.svelte';
	import DropType from '$lib/components/create/DropType.svelte';
	import ListTypeConfirm from '$lib/components/create/ListTypeConfirm.svelte';
	import StepTitle from '$lib/components/create/StepTitle.svelte';

	const dropTypes = [
		{ listingType: 'sale', title: 'Sale', imgUrl: '/img/create/drop-type-sale.svg' },
		{ listingType: 'auction', title: 'Auction', imgUrl: '/img/create/drop-type-auction.svg' },
		{ listingType: 'raffle', title: 'Raffle', imgUrl: '/img/create/drop-type-raffle.svg' }
	];

	function handleClick(dropType) {
		setPopup(ListTypeConfirm, { props: dropType });
	}
</script>

<hr class="separator" />

<h1 class="italic font-light uppercase mt-8 text-xl">Step 3: Choose listing format</h1>

<p class="font-poppins text-[#585858] mt-8">Allow other users to make bids on your NFT</p>

<div class="grid grid-cols-3 mt-8 gap-16 mb-64">
	{#each dropTypes as dropType}
		<CardButton on:click={() => handleClick(dropType)}>
			<DropType imgUrl={dropType.imgUrl} title={dropType.title} />
		</CardButton>
	{/each}
</div>
