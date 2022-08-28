<script lang="ts">
	import type { CardOptions } from '$interfaces/ui';

	import { likedNftIds } from '$stores/user';
	import { makeHttps } from '$utils/ipfs';

	import { getIconUrl } from '$utils/misc/getIconUrl';
	import type { PopupHandler } from '$utils/popup';

	import Popup from '../Popup.svelte';
	import AssetContainer from './sections/AssetContainer.svelte';
	import RightSection from './sections/RightSection.svelte';

	export let options: CardOptions;
	export let handler: PopupHandler;

	// Showing of the back button is controlled by the RightSection component
	let showBackButton = false;

	let rightSectionInstance;

	const countdownData = options?.resourceType === 'listing' ? { startTime: options.listingData?.startTime, duration: options.listingData?.duration } : null;

	// Log data that was used by the adapter to generate the CardPopup
	$: console.debug('[Resource Data]:', options.rawResourceData);
</script>

<Popup class="w-full h-full overflow-y-auto rounded-none lg:rounded-xl lg:w-[1000px] lg:max-h-[700px] pb-8 transition-all duration-200 overscroll-contain" closeButton on:close={handler.close}>
	<!-- Back button -->
	<button class="absolute flex items-center flex-grow-0 gap-2 px-10 btn disabled:opacity-0 top-4" disabled={!showBackButton} on:click={rightSectionInstance.goBack()}>
		<img src={getIconUrl('back-button')} alt="Arrow pointing left." />
		<p class="text-sm font-semibold text-color-black">GO BACK</p>
	</button>

	<!-- Main content -->
	<div class="flex mx-10 flex-row flex-wrap justify-around gap-y-8">
		<!-- Left part with image and buttons -->
		<div class="min-h-[500px] w-[320px] overflow-y-auto">
			<AssetContainer
				assetUrl={makeHttps(options.nfts[0].assetUrl)}
				title={options.nfts[0].name ?? `#${options.nfts[0]?.onChainId}` ?? 'No Title'}
				{options}
				favorited={$likedNftIds.includes(options.nfts[0].onChainId)}
				countdown={countdownData}
				thumbnailUrl={makeHttps(options.nfts[0]?.thumbnailUrl)}
			/>
		</div>

		<!-- Right part with info and actions -->
		<div class="pt-8 w-[450px] flex-grow border-t lg:border-none">
			<RightSection {options} on:close-popup={handler.close} bind:showBackButton bind:this={rightSectionInstance} />
		</div>
	</div>
</Popup>
