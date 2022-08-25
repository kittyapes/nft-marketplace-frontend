<script lang="ts">
	import { browser } from '$app/env';

	import type { CardOptions } from '$interfaces/ui';

	import { likedNftIds } from '$stores/user';
	import { makeHttps } from '$utils/ipfs';

	import { getIconUrl } from '$utils/misc/getIconUrl';
	import type { PopupHandler } from '$utils/popup';
	import { onDestroy, onMount } from 'svelte';

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

<Popup class="w-full h-full overflow-y-auto rounded-none lg:rounded-xl lg:w-[1000px] lg:h-[700px] pb-8 transition-all duration-200 overscroll-contain" closeButton on:close={handler.close}>
	<!-- Back button -->
	<button class="absolute flex items-center flex-grow-0 gap-2 px-10 btn disabled:opacity-0 top-4" disabled={!showBackButton} on:click={rightSectionInstance.goBack()}>
		<img src={getIconUrl('back-button')} alt="Arrow pointing left." />
		<p class="text-sm font-semibold text-color-black">GO BACK</p>
	</button>

	<!-- Main content -->
	<div class="flex flex-col h-full mx-10 lg:flex-row">
		<!-- Left part with image and buttons -->
		<div class="h-full lg:w-2/5">
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
		<div class="self-stretch h-full pt-4 lg:w-3/5">
			<RightSection {options} on:close-popup={handler.close} bind:showBackButton bind:this={rightSectionInstance} />
		</div>
	</div>
</Popup>
