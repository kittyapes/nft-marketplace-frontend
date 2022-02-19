<script>
	import { setPopup } from '$utils/popup';
	import CardButton from '../_lib/CardButton.svelte';
	import DropType from '../_lib/DropType.svelte';
	import DropTypeConfirm from '../_lib/DropTypeConfirm.svelte';
	import StepTitle from '../_lib/StepTitle.svelte';

	const dropTypes = [
		{ relHref: 'sale', title: 'Sale', imgUrl: '/img/create/drop-type-sale.svg' },
		{ relHref: 'auction', title: 'Auction', imgUrl: '/img/create/drop-type-auction.svg' },
		{ relHref: 'raffle', title: 'Raffle', imgUrl: '/img/create/drop-type-raffle.svg' }
	];

	function handleClick(dropType) {
		setPopup(DropTypeConfirm, { props: dropType });
	}
</script>

<hr class="separator" />

<StepTitle blackText="Step 2: Choose drop type" />

<p class="font-poppins text-[#585858] mt-8">Allow other users to make bids on your NFT</p>

<div class="grid grid-cols-3 mt-8 gap-16 mb-64">
	{#each dropTypes as dropType}
		<CardButton on:click={() => handleClick(dropType)}>
			<DropType imgUrl={dropType.imgUrl} title={dropType.title} />
		</CardButton>
	{/each}
</div>
