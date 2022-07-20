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
	import { onMount } from 'svelte';
	import { notifyError } from '$utils/toast';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import { MetaTags } from 'svelte-meta-tags';
	import HinataBadge from '$icons/hinata-badge.svelte';

	let collectionData: Collection;
	let nfts = [];
	let creatorData: UserData;

	let reachedEnd = false;
	let isLoading = true;

	let index = 1;
	const limit = 15;

	let fetchFunction = async () => {
		const res = {} as FetchFunctionResult;
		res.res = await apiGetCollectionBySlug($page.params.collectionSlug, limit, index);
		res.adapted = await Promise.all(res.res.nfts.map((nft) => apiNftToNftCard(nft)));
		return res;
	};

	async function fetchMore() {
		if (reachedEnd) return;
		isLoading = true;

		const res = await fetchFunction();

		if (res.err) {
			console.error(res.err);
			notifyError('Failed to fetch more collections.');
			return;
		}

		if (res.adapted.length === 0) {
			reachedEnd = true;
		} else {
			nfts = [...nfts, ...res.adapted];
			index++;
		}

		isLoading = false;
	}

	onMount(async () => {
		await fetchMore();
	});

	const collectionStats = {
		highestSale: {
			stat: 'Highest Sale',
			value: 0,
			symbol: 'WETH'
		},
		floorPrice: {
			stat: 'Floor Price',
			value: 0,
			symbol: 'WETH'
		},
		totalVol: {
			stat: 'Total Volume',
			value: 0,
			symbol: ''
		},
		items: {
			stat: 'Items',
			value: 0,
			symbol: ''
		},
		owners: {
			stat: 'Owners',
			value: 0,
			symbol: ''
		},
		total24hours: {
			stat: '24Hr Volume',
			value: 0,
			symbol: 'WETH'
		}
	};

	async function fetchCollectionData() {
		collectionData = await apiGetCollectionBySlug($page.params.collectionSlug).catch((e) => undefined);
		console.log(collectionData);

		// Populate collection stats
		let formatter = Intl.NumberFormat('en', { notation: 'compact' });
		Object.keys(collectionStats).map((key) => {
			if (collectionData?.[key]) {
				collectionStats[key].value = formatter.format(collectionData[key]);
			}
		});

		creatorData = await fetchProfileData(collectionData?.creator).catch((e) => undefined);
	}

	$: fetchCollectionData();

	let collectionMenuButtonOptions = [
		// REMEMBER TO SET THESE TO TRUE
		/*{ label: 'Claim Ownership', action: () => {}, disabled: true },*/
		{ label: 'Report', action: () => {}, disabled: true }
	];

	$: if ($currentUserAddress && creatorData && $currentUserAddress.toLowerCase() === creatorData.address.toLowerCase()) {
		collectionMenuButtonOptions = [
			/*{ label: 'Claim Ownership', action: () => {}, disabled: true },*/
			{ label: 'Report', action: () => {}, disabled: true },
			{ label: 'Edit', action: () => goto(`/collections/${collectionData.slug}/edit`), disabled: $currentUserAddress.toLowerCase() !== creatorData.address.toLowerCase() }
		];
	}

	let menuButton: HTMLButtonElement;
	let showCollectionMenu = false;

	let menuAttachElement: AttachToElement;
	onMount(() => document.addEventListener('scroll', () => menuAttachElement?.recalc()));
</script>

{#if collectionData}
	<MetaTags
		title={collectionData?.name + ' - Collection | Hinata Marketplace'}
		description={collectionData?.description}
		canonical={'https://hinata.io/' + collectionData?.slug}
		openGraph={{
			type: 'website',
			url: 'https://hinata.io/' + collectionData?.slug,
			title: collectionData?.name + ' - Collection | Hinata Marketplace',
			description: collectionData?.description,
			images: [
				{
					url: collectionData?.backgroundImageUrl,
					width: 800,
					height: 400,
					alt: collectionData?.name + 'Collection banner image.'
				}
			],
			site_name: 'Hinata'
		}}
	/>
{/if}

<main class="px-16 mx-auto">
	<div class="relative mt-8">
		<!-- Cover image -->
		<img
			class="object-cover w-full h-64 rounded-md"
			src={collectionData?.backgroundImageUrl ||
				'https://media.istockphoto.com/photos/abstract-geometric-network-polygon-globe-graphic-background-picture-id1208738316?b=1&k=20&m=1208738316&s=170667a&w=0&h=f4KWULKjL770nceDM6xi32EbfIgMtBwSp5fPxIx08wc='}
			alt=""
		/>

		<!-- Creator profile image - TODO ADD LOGIC FOR VERIFIED CREATOR BADGE -->
		<div class="absolute bottom-0 left-0 right-0 w-24 h-24 mx-auto translate-y-12 grid place-items-center">
			<img class="object-cover w-20 h-20 bg-white border-4 border-white rounded-full " src={collectionData?.logoImageUrl || '/svg/icons/guest-avatar.svg'} alt="Collection creator avatar." />

			<!-- Verified creator badge -->
			{#if collectionData?.mintedFrom?.toLowerCase() === 'hinata'}
				<HinataBadge class="w-6 h-6 absolute right-2 translate-y-6" />
			{/if}
		</div>
	</div>

	<!-- Collection title -->
	<h1 class="mx-auto mt-12 text-2xl font-semibold max-w-max">
		{#if collectionData}
			{collectionData?.name || 'N/A'}
		{:else}
			<div class="w-32 h-8 bg-gray-100 rounded-lg" />
		{/if}
	</h1>

	<!-- Creator username and collection address -->
	<div class="flex items-center justify-center mt-2 space-x-3">
		<div class="text-xl font-medium text-color-gradient max-w-max font-poppins">
			{#if creatorData?.username}
				@{creatorData?.username}
			{/if}
		</div>

		<button class="btn bg-[#F5F5F5] flex rounded-full px-4 py-2 space-x-2 w-36" on:click={() => copyTextToClipboard(collectionData?.collectionAddress)}>
			<img class="w-5" src="/svg/icons/collection-gradient-eth.svg" alt="Ethereum." />
			{#if collectionData}
				<div class="font-mono text-[#6E6E6E] text-sm">{shortenAddress(collectionData?.collectionAddress)}</div>
			{:else}
				<div class="w-24 h-5 bg-gray-200 rounded-lg" />
			{/if}
		</button>
	</div>

	<!-- Stats table -->
	{#if collectionData}
		<div class="flex h-24 max-w-3xl mx-auto mt-8 border border-black rounded-lg justify-evenly">
			{#each Object.keys(collectionStats) as statKey}
				<div class="flex flex-col items-center justify-center w-full border-r border-black last:border-0">
					<div class="text-sm">{collectionStats[statKey].stat}</div>
					<div class="mt-1 text-xl font-semibold">{collectionStats[statKey].value} {collectionStats[statKey].symbol}</div>
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
		{#if nfts.length}
			<NftList options={nfts} {isLoading} {reachedEnd} on:end-reached={fetchMore} />
		{:else if collectionData && !nfts.length && $currentUserAddress === collectionData.creator}
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
