<script lang="ts">
	import Eth from '$icons/eth.svelte';
	import Loader from '$icons/loader.svelte';
	import type { CardOptions } from '$interfaces/ui';
	import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
	import { apiGetCollectionBySlug } from '$utils/api/collection';
	import { makeHttps } from '$utils/ipfs';
	import { addUrlParam } from '$utils/misc/addUrlParam';
	import { removeUrlParam } from '$utils/misc/removeUrlParam';
	import { setPopup, updatePopupProps } from '$utils/popup';
	import { reject } from 'lodash-es';

	export let options: CardOptions;
	export let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';
	const nft = options?.nfts?.[0];
	let fileType: string;
	let imgLoaded = false;
	async function handleClick(ev) {
		if (!options.allowPopup) return;

		const id = options.resourceType === 'nft' ? options.nfts[0].fullId : options.listingData.onChainId;

		addUrlParam('id', id);

		const popupHandler = setPopup(CardPopup, { props: { options }, onClose: () => removeUrlParam('id') });

		// Load complete collection data after opening the popup
		if (options.nfts[0].collectionData.slug) {
			const collectionData = await apiGetCollectionBySlug(options.nfts[0].collectionData.slug);

			// Replace partial collection data with complete collection data fetched from API
			if (collectionData) options.nfts[0].collectionData = collectionData;
			updatePopupProps(popupHandler?.id, { options });
		}
	}

	const preload = async (src) => {
		const resp = await fetch(makeHttps(src));
		const blob = await resp.blob();
		fileType = blob.type.split('/')[0];

		return new Promise(function (resolve) {
			let reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = () => {
				imgLoaded = true;
				resolve(reader.result);
			};
			reader.onerror = (error) => {
				imgLoaded = false;
				reject(`Error: ${error}`);
			};
		});
	};
</script>

<div on:click={handleClick} class:cursor-pointer={options.allowPopup} class="flex flex-col">
	<div class:normal-nft-media={gridStyle === 'normal'} class:dense-nft-media={gridStyle === 'dense'}>
		{#await preload(options.nfts[0].thumbnailUrl)}
			<div class="w-full h-full bg-dark-gradient">
				<Loader />
			</div>
		{:then}
			{#if fileType === 'video'}
				<video
					crossorigin="anonymous"
					class="max-w-full max-h-full object-cover object-top w-full h-full transition {gridStyle === 'masonry' ? 'mb-4 2xl:mb-5' : ''}"
					autoplay
					loop
					class:opacity-0={!imgLoaded}
				>
					<source src={options.nfts[0].thumbnailUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img alt="" src={options.nfts[0].thumbnailUrl} class="w-full h-full object-center object-cover transition {gridStyle === 'masonry' ? 'mb-4 2xl:mb-5' : ''}" class:opacity-0={!imgLoaded} />
			{/if}
		{:catch _err}
			{#if fileType === 'video'}
				<video
					crossorigin="anonymous"
					class="max-w-full max-h-full object-cover object-top w-full h-full transition {gridStyle === 'masonry' ? 'mb-4 2xl:mb-5' : ''}"
					autoplay
					loop
					class:opacity-0={!imgLoaded}
				>
					<source src={options.nfts[0].thumbnailUrl} type="video/mp4" />
					<track kind="captions" />
				</video>
			{:else if fileType === 'image'}
				<img alt="" src={options.nfts[0].thumbnailUrl} class="w-full h-full object-center object-cover transition {gridStyle === 'masonry' ? 'mb-4 2xl:mb-5' : ''}" class:opacity-0={!imgLoaded} />
			{/if}
		{/await}
	</div>
	<div class:normal-nft-details={gridStyle === 'normal'} class:dense-nft-details={gridStyle === 'dense'} class:hidden={gridStyle === 'masonry'} class="bg-dark-gradient w-full">
		<h4 class="text-gradient font-bold {gridStyle === 'normal' ? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7' : 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}">
			{nft?.collectionData?.name}
		</h4>
		<h3 class="text-white font-semibold {gridStyle === 'normal' ? 'text-base 2xl:text-xl leading-6 2xl:leading-7' : 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}">{nft?.name}</h3>
		<div class="flex flex-row items-center justify-between mt-2.5 ">
			<div class="flex flex-col items-start">
				<h4 class="text-gradient font-bold {gridStyle === 'normal' ? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7' : 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}">Highest Bid</h4>
				<div class="flex flex-row items-center {gridStyle === 'normal' ? 'gap-x-1' : 'gap-x-0.5'}">
					<span><Eth class={gridStyle === 'normal' ? 'w-2.5 2xl:w-3 h-3.5 2xl:h-4' : 'w-1.5 2xl:w-2 h-2.5 2xl:h-3'} /></span>
					<h3 class="text-white font-semibold {gridStyle === 'normal' ? 'text-base 2xl:text-xl leading-6 2xl:leading-7' : 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}">84</h3>
				</div>
			</div>
			<div class="flex flex-col items-end">
				<h4 class="text-gradient font-bold {gridStyle === 'normal' ? 'text-[10px] 2xl:text-sm leading-6 2xl:leading-7' : 'text-[8px] 2xl:text-[10px] leading-3 2xl:leading-4'}">Ends In</h4>
				<h3 class="text-white font-semibold {gridStyle === 'normal' ? 'text-base 2xl:text-xl leading-6 2xl:leading-7' : 'text-xs 2xl:text-sm leading-3 2xl:leading-4'}">18h 05m 46s</h3>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.normal-nft-details {
		@apply py-2.5 2xl:py-3 px-4 2xl:px-5;
	}
	.dense-nft-details {
		@apply py-1.5 px-2.5;
	}
	.normal-nft-media {
		@apply h-[321px] 2xl:h-[400px];
	}
	.dense-nft-media {
		@apply h-44 2xl:h-56;
	}
</style>
