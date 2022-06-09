<script lang="ts">
	import type { CardPopupOptions } from '$interfaces/cardPopupOptions';
	import { getIconUrl } from '$utils/misc/getIconUrl';
	import type { PopupHandler } from '$utils/popup';

	import Popup from '../Popup.svelte';
	import AssetContainer from './sections/AssetContainer.svelte';

	export let options: CardPopupOptions;
	export let handler: PopupHandler;
</script>

<Popup class="w-full h-full rounded-none lg:rounded-xl lg:w-[64rem] lg:h-[40rem]" closeButton on:close={handler.close}>
	<!-- Back button -->
	<button class="flex items-center gap-2 px-10 btn">
		<img src={getIconUrl('back-button')} alt="Arrow pointing left." />
		<p class="text-sm font-semibold text-color-black">GO BACK</p>
	</button>

	<div class="flex flex-col h-full mx-10 lg:flex-row">
		<div class="h-full lg:w-2/5">
			<AssetContainer assetUrl={options.assetUrl} title={options.title} id={options.id} />
		</div>
	</div>
</Popup>
