<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { DropListingType } from '$interfaces/drops';
	import Popup from '$lib/components/Popup.svelte';
	import type { PopupHandler } from '$utils/popup';

	export let imgUrl;
	export let title;
	export let listingType: DropListingType;
	export let handler: PopupHandler;
	export let confirmDetail: string;

	function handleConfirm() {
		handler.close();
		goto('/create/list/' + $page.params.bundleId + '?type=' + listingType);
	}
</script>

<Popup closeButton on:close={handler.close}>
	<div class="min-w-[800px] min-h-[500px] flex flex-col items-center justify-center">
		<div class="bg-[#F4F4F4] w-48 h-48 rounded-full flex flex-col justify-center items-center">
			<img src={imgUrl} alt="" class="-mt-4" />
			<div class="mt-2 text-lg font-bold">{title}</div>
		</div>

		<div class="mt-8 text-2xl font-bold text-center">Confirm Your Selection</div>
		<div class="mt-2 text-center max-w-prose">{confirmDetail || 'N/A'}</div>

		<button class="mt-16 font-bold uppercase btn btn-gradient btn-rounded" on:click={handleConfirm}>Confirm</button>
	</div>
</Popup>
