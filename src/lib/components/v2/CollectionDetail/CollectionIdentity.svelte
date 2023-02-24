<script lang="ts">
	import type { Collection } from '$utils/api/collection';
	import HinataBadge from '$icons/hinata-badge.svelte';
	import EllipsisVerticalIcon from '$icons/ellipsis-vertical-icon.svelte';
	import { slide } from 'svelte/transition';
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import EthAddress from '$lib/components/EthAddress.svelte';
	import EthV2 from '$icons/eth-v2.svelte';
	import type { UserData } from '$interfaces/userData';
	import VerifiedBadge from '$icons/verified-badge.svelte';

	export let collectionData: Collection;
	export let creatorData: UserData;

	let showCollectionMenu = false;

	$: address = collectionData?.collectionAddress;

	const reportCollection = async () => {
		// TODO logic to report a collection
	};
</script>

<div class="flex flex-row gap-x-5 items-end">
	<div class="w-28 h-28 flex items-center justify-center overflow-hidden ">
		<img src={collectionData?.logoImageUrl || '/svg/icons/guest-avatar.svg'} class="object-center object-cover" alt="Collection creator avatar." />
	</div>
	<div class="flex flex-col gap-y-6">
		<div class="flex flex-row items-center gap-x-4">
			<h1 class="font-semibold text-4xl leading-6 whitespace-nowrap">{collectionData?.name || ''}</h1>
			<HinataBadge class="w-8 h-8 {collectionData?.mintedFrom.toLowerCase() === 'hinata' ? '' : 'block'}" />
			<div class="relative w-1 h-5">
				<button
					on:click={() => {
						showCollectionMenu = !showCollectionMenu;
					}}
				>
					<EllipsisVerticalIcon gradient={showCollectionMenu} class="w-full h-full" />
				</button>

				{#if showCollectionMenu}
					<div
						use:outsideClickCallback={{
							cb: () => (showCollectionMenu = false),
						}}
						transition:slide|local
						class="bg-dark-gradient min-w-[10rem] font-medium text-sm leading-5"
					>
						<button
							on:click={async () => {
								await reportCollection();
								showCollectionMenu = false;
							}}
							class="w-full inline-flex pl-5 py-3.5 hover:bg-main-gradient"
						>
							Report
						</button>
					</div>
				{/if}
			</div>
		</div>
		<div class="flex flex-row items-center gap-x-4">
			<h3 class="text-gradient text-xl leading-6 whitespace-nowrap">{creatorData?.username || ''}</h3>

			<VerifiedBadge class="w-6 h-6 {creatorData?.roles?.includes('verified_user') ? '' : 'block'}" />

			<div class="flex flex-row items-center bg-black bg-opacity-25 py-1 px-3 gap-2">
				<EthV2 />
				<EthAddress {address} concat etherScanLink={false} class="!text-white !gap-2" />
			</div>
		</div>
	</div>
</div>
