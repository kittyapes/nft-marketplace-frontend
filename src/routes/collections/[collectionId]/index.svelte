<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AddCircle from '$icons/add-circle.svelte';
	import type { UserData } from '$interfaces/userData';
	import ActionMenu from '$lib/components/ActionMenu.svelte';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import NftList from '$lib/components/NftList.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { apiNftToNftCard } from '$utils/adapters/apiNftToNftCard';
	import { apiGetCollectionBySlug, type Collection } from '$utils/api/collection';
	import { fetchProfileData } from '$utils/api/profile';
	import copyTextToClipboard from '$utils/copyTextToClipboard';
	import { copyUrlToClipboard } from '$utils/misc/clipboard';
	import { shortenAddress } from '$utils/misc/shortenAddress';
	import { nftDraft } from '$stores/create';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { onMount } from 'svelte';

	let collectionData: Collection;
	let creatorData: UserData;

	async function fetchCollectionData() {
		collectionData = await apiGetCollectionBySlug($page.params.collectionId).catch((e) => undefined);
		creatorData = await fetchProfileData(collectionData?.creator).catch((e) => undefined);
	}

	$: $currentUserAddress && fetchCollectionData();

	const collectionStats = [
		['Highest Sale', '$0.2M'],
		['Floor Price', '100 ETH'],
		['Total Volume', '$3.5B'],
		['Items', '9.8K'],
		['Owners', '6.5K'],
		['24hr Volume', '$12.4M']
	];

	const collectionMenuButtonOptions = [
		{ label: 'Claim Ownership', action: () => {}, disabled: true },
		{ label: 'Report', action: () => {}, disabled: true },
		{ label: 'Edit', action: () => goto(`/collections/${collectionData.slug}/edit`) }
	];

	let menuButton: HTMLButtonElement;
	let showCollectionMenu = false;

	let menuAttachElement: AttachToElement;

	onMount(() => document.addEventListener('scroll', () => menuAttachElement?.recalc()));
</script>

<main class="px-16 mx-auto">
	<div class="relative mt-8">
		<!-- Cover image -->
		<img
			class="object-cover w-full h-64 rounded-md"
			src={collectionData?.backgroundImageUrl ||
				'https://media.istockphoto.com/photos/abstract-geometric-network-polygon-globe-graphic-background-picture-id1208738316?b=1&k=20&m=1208738316&s=170667a&w=0&h=f4KWULKjL770nceDM6xi32EbfIgMtBwSp5fPxIx08wc='}
			alt=""
		/>

		<!-- Creator profile image -->
		<div class="absolute bottom-0 left-0 right-0 w-24 h-24 mx-auto translate-y-12">
			<img class="object-cover w-20 h-20 bg-white border-4 border-white rounded-full " src={collectionData?.logoImageUrl || '/svg/icons/guest-avatar.svg'} alt="Collection creator avatar." />

			<!-- Verified creator badge -->
			<img class="absolute right-0 -translate-y-8" src="/svg/icons/verified-creator-badge.svg" alt="Verified creator badge." />
		</div>
	</div>

	<!-- Collection title -->
	<h1 class="mx-auto mt-8 text-2xl font-semibold max-w-max">
		{#if collectionData}
			{collectionData?.name || 'N/A'}
		{:else}
			<div class="w-32 h-8 bg-gray-100 rounded-lg" />
		{/if}
	</h1>

	<!-- Creator username and address -->
	<div class="flex items-center justify-center mt-2 space-x-3">
		<div class="text-xl font-medium text-color-gradient max-w-max font-poppins">
			{#if creatorData}
				@{creatorData?.username}
			{:else}
				<div class="w-32 h-8 bg-gray-100 rounded-lg" />
			{/if}
		</div>

		<button class="btn bg-[#F5F5F5] flex rounded-full px-4 py-2 space-x-2 w-36" on:click={() => copyTextToClipboard(collectionData.creator)}>
			<img class="w-5" src="/svg/icons/collection-gradient-eth.svg" alt="Ethereum." />
			{#if creatorData}
				<div class="font-mono text-[#6E6E6E] text-sm">{shortenAddress(creatorData?.address)}</div>
			{:else}
				<div class="w-24 h-5 bg-gray-200 rounded-lg" />
			{/if}
		</button>
	</div>

	<!-- Stats table -->
	{#if collectionData}
		<div class="flex h-24 max-w-3xl mx-auto mt-8 border border-black rounded-lg justify-evenly">
			{#each collectionStats as [stat, value]}
				<div class="flex flex-col items-center justify-center w-full border-r border-black last:border-0">
					<div class="text-sm">{stat}</div>
					<div class="mt-1 text-xl font-semibold">{value}</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="h-24 max-w-3xl mx-auto mt-8 bg-gray-100 rounded-lg" />
	{/if}

	<!-- Share and menu buttons -->
	<div class="flex justify-center mt-6 space-x-4">
		<!-- Share button -->
		<button class="grid border border-black rounded-full btn w-14 h-14 place-items-center" on:click={copyUrlToClipboard}>
			<img src="/svg/icons/collection-upload.svg" alt="Share." />
		</button>

		<!-- Menu button -->
		<button class="grid border border-black rounded-full btn w-14 h-14 place-items-center" bind:this={menuButton} on:click={() => (showCollectionMenu = !showCollectionMenu)}>
			<img src="/svg/icons/collection-menu.svg" alt="Upload." />
		</button>
	</div>

	<div class="mt-16 border-t border-[#0000004D]">
		{#if collectionData?.nfts?.length}
			{#if collectionData}
				{#await Promise.all(collectionData.nfts.map((nftData) => apiNftToNftCard(nftData, { collection: collectionData }))) then nfts}
					<NftList options={nfts} />
				{/await}
			{:else}
				<NftList options={[]} />
			{/if}
		{:else if collectionData && !collectionData.nfts?.length && $currentUserAddress === collectionData.creator}
			<div
				class="grid place-items-center border border-dashed border-opacity-30 border-color-gray-base h-60 clickable hover:scale-105 transition-all p10 rounded-2xl max-w-[246px] my-10"
				on:click={() => {
					$nftDraft.collectionName = collectionData.name;
					goto('/create');
				}}
			>
				<div class="flex flex-col items-center justify-center gap-4">
					<button class="rounded-full btn">
						<AddCircle />
					</button>
					<div class="text-color-gray-dark">Create a new NFT</div>
				</div>
			</div>
		{/if}
	</div>
</main>

{#if showCollectionMenu}
	<AttachToElement to={menuButton} bottom right bind:this={menuAttachElement}>
		<ActionMenu options={collectionMenuButtonOptions} on:optionClick={() => (showCollectionMenu = false)} />
	</AttachToElement>
{/if}
