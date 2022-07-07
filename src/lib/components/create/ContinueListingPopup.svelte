<script>
	import { goto } from '$app/navigation';
	import Popup from '$lib/components/Popup.svelte';
	import { closePopup } from '$utils/popup';

	function chooseDropType() {
		goto('/create/choose-listing-format');
		closePopup();
	}

	function viewNft() {}
</script>

<Popup closeButton>
	<div class="min-w-[800px] min-h-[550px] flex flex-col items-center justify-center">
		<div class="bg-[#F4F4F4] w-48 h-48 rounded-full flex flex-col justify-center items-center">
			<img src="/img/create/listing-icon.svg" alt="" class="mt-4" />
			<div class="font-bold mt-4 text-lg">Listing</div>
		</div>

		<div class="text-center text-2xl font-bold mt-8">Proceed to List your Drop?</div>
		<div class="max-w-prose text-center mt-2">Listing an NFT will reqiure a small network fee. Once you choose the listing format you will be prompted to send an Ethereum transaction.</div>

		<div class="flex gap-8 mt-12">
			<button class="btn btn-gradient btn-rounded uppercase font-bold w-72 h-14" on:click={viewNft}>View NFT</button>

			<button class="btn btn-gradient btn-rounded uppercase font-bold w-72 h-14" on:click={chooseDropType}>Choose listing format</button>
		</div>
	</div>
</Popup>
