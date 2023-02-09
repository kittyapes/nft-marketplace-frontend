<script lang="ts">
	import ListingSuccessIcon from '$icons/listing-success-icon.svelte';
	import type { PopupHandler } from '$utils/popup';
	import Popup from '../Popup.svelte';
	import ResponsovePopupContainer from '../ResponsovePopupContainer.svelte';
	import PrimaryButton from '../v2/PrimaryButton/PrimaryButton.svelte';

	export let handler: PopupHandler;
	export let viewCallback: () => void;

	function click() {
		handler.close();
		viewCallback();
	}
</script>

<Popup>
	<ResponsovePopupContainer>
		<div class="flex flex-col items-center justify-center w-full h-full text-white">
			<ListingSuccessIcon class="w-32 h-32" />
			<div class="mt-6 text-4xl font-bold">NFT Listed Successfully</div>
			<p class="max-w-lg mt-4 text-center">Congratulations! You have created and listed and NFT successfully, click View NFT to be re-directed to your listing on your profile!</p>

			<div class="w-48 grid mt-16">
				<PrimaryButton on:click={click}>View NFT</PrimaryButton>
			</div>
		</div>
	</ResponsovePopupContainer>
</Popup>
