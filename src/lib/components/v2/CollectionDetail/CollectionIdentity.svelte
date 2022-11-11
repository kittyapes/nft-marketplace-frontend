<script lang="ts">
	import type { Collection } from '$utils/api/collection';

	export let collectionData: Collection;
	import HinataBadge from '$icons/hinata-badge.svelte';
	import Eth from '$icons/eth.svelte';
	import EllipsisVerticalIcon from '$icons/ellipsis-vertical-icon.svelte';
	import Copy from '$icons/copy.svelte';
	import { shortenAddress } from '$utils/misc/shortenAddress';
	import copyTextToClipboard from '$utils/copyTextToClipboard';
</script>

<div class="flex flex-row gap-x-4 2xl:gap-x-5 items-end">
	<div class="w-20 h-20 2xl:w-28 2xl:h-28 flex items-center justify-center overflow-hidden bg-slate-700">
		<img src={collectionData?.logoImageUrl || '/svg/icons/guest-avatar.svg'} class="objeect-center object-cover" alt="Collection creator avatar." />
	</div>
	<div class="flex flex-col gap-y-5 2xl:gap-y-7">
		<div class="flex flex-row items-center gap-x-2 2xl:gap-x-2.5">
			<h1 class="font-semibold text-2xl 2xl:text-4xl leading-4 2xl:leading-6 whitespace-nowrap">{collectionData?.name || ''}</h1>
			<HinataBadge class="w-6 h-6 2xl:h-8 2xl:w-8 {collectionData?.verified ? '' : 'block'}" />
			<button><EllipsisVerticalIcon class="w-1 h-4 2xl:h-5" /></button>
		</div>
		<div class="flex flex-row items-center gap-x-2 2xl:gap-x-2.5">
			<h3 class="text-gradient text-base 2xl:text-xl leading-4 2xl:leading-6 whitespace-nowrap">{collectionData?.name || ''}</h3>
			<HinataBadge class="w-5 h-5 2xl:h-6 2xl:w-6 {collectionData?.verified ? '' : 'block'}" />
			<div class="flex flex-row items-center bg-black bg-opacity-25 px-2.5 py-1.5 gap-x-2.5">
				<Eth gradient class="w-2.5 h-4 2xl:w-3 2xl:h-5" />
				<p class="text-xs 2xl:text-base leading-5 2xl:leading-6">{shortenAddress(collectionData?.collectionAddress) || ''}</p>
				<button
					on:click={() => {
						copyTextToClipboard(collectionData?.collectionAddress);
					}}
				>
					<Copy class="w-2.5 h-4 2xl:w-3 2xl:h-5" />
				</button>
			</div>
		</div>
	</div>
</div>
