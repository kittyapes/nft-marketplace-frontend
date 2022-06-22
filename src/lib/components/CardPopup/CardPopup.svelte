<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import type { PopupHandler } from '$utils/popup';

	import Popup from '../Popup.svelte';
	import AssetContainer from './sections/AssetContainer.svelte';
	import RightSection from './sections/RightSection.svelte';

	export let options: CardPopupOptions;
	export let handler: PopupHandler;

	console.log(options);

	// Showing of the back button is controlled by the RightSection component
	let showBackButton = false;

	let rightSectionInstance;

	// Log data that was used by the adapter to generate the CardPopup
	$: console.debug('[Resource Data]:', options.rawResourceData);
</script>

<Popup class="w-full h-full rounded-none lg:rounded-xl lg:w-[64rem] lg:h-[40rem]" closeButton on:close={handler.close}>
	<!-- Back button -->
	<button class="flex items-center flex-grow-0 gap-2 px-10 btn disabled:opacity-0" disabled={!showBackButton} on:click={rightSectionInstance.goBack()}>
		<img src={getIconUrl('back-button')} alt="Arrow pointing left." />
		<p class="text-sm font-semibold text-color-black">GO BACK</p>
	</button>

	<!-- Main content -->
	<div class="flex flex-col h-full mx-10 lg:flex-row">
		<!-- Left part with image and buttons -->
		<div class="h-full lg:w-2/5">
			<AssetContainer assetUrl={options.assetUrl} title={options.title} {options} favorited={false} />
		</div>

		<!-- Right part with info and actions -->
		<div class="h-full lg:w-3/5">
			<RightSection {options} on:close-popup={handler.close} bind:showBackButton bind:this={rightSectionInstance} />
		</div>
	</div>
</Popup>
