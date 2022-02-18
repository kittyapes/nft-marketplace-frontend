<script>
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import Popup from '$lib/components/Popup.svelte';
	import { closePopup } from '$utils/popup';

	export let imgUrl;
	export let title;
	export let relHref;

	function handleConfirm() {
		goto($page.path + '/' + relHref);
		closePopup();
	}
</script>

<Popup closeButton>
	<div class="min-w-[80vw] min-h-[50vh] flex flex-col items-center justify-center">
		<div class="bg-[#F4F4F4] w-48 h-48 rounded-full flex flex-col justify-center items-center">
			<img src={imgUrl} alt="" class="-mt-4" />
			<div class="font-bold -mt-6 text-lg">{title}</div>
		</div>

		<div class="text-center text-2xl font-bold mt-8">Lorem Ipsum dolor sit amet, consectetur</div>
		<div class="max-w-prose text-center mt-2">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua. Ut
		</div>

		<button class="btn btn-gradient btn-rounded uppercase mt-16 font-bold" on:click={handleConfirm}>
			Confirm
		</button>
	</div>
</Popup>
