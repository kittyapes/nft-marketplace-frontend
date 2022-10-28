<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Popup from '$lib/components/Popup.svelte';
	import type { ListingType } from '$utils/api/listing';
	import type { PopupHandler } from '$utils/popup';
	import PrimaryButton from '../v2/PrimaryButton/PrimaryButton.svelte';

	export let iconComponent;
	export let listingType: ListingType;
	export let handler: PopupHandler;
	export let confirmDetail: string;

	function handleConfirm() {
		handler.close();
		goto('/create/list/' + $page.params.bundleId + '?type=' + listingType);
	}
</script>

<Popup closeButton on:close={handler.close}>
	<div class="min-w-[800px] min-h-[500px] flex flex-col items-center justify-center text-white">
		<div class="w-48 h-48 flex flex-col justify-center items-center gradient-border-bg p-1">
			<div class="bg-dark-gradient w-full h-full flex items-center justify-center">
				<svelte:component this={iconComponent} />
			</div>
		</div>

		<div class="mt-8 text-2xl font-bold text-center">Confirm Your Selection</div>
		<div class="mt-2 text-center text-lg max-w-lg">{confirmDetail || 'N/A'}</div>

		<div class="mt-16 w-48">
			<PrimaryButton on:click={handleConfirm}>Confirm</PrimaryButton>
		</div>
	</div>
</Popup>
