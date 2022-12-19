<script lang="ts">
	import { page } from '$app/stores';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import type { UserData } from '$interfaces/userData';
	import { nftToCardOptions } from '$utils/adapters/cardOptions';
	import { apiGetCollectionBySlug, type Collection } from '$utils/api/collection';
	import { fetchProfileData } from '$utils/api/profile';
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import NftGrid from '$components/v2/NFTGrid/+page.svelte';
	import { filterNfts } from '$utils/nfts/search';
	import CollectionIdentity from '$lib/components/v2/CollectionDetail/CollectionIdentity.svelte';
	import CollectionValues from '$lib/components/v2/CollectionDetail/CollectionValues.svelte';
	import CollectionDescription from '$lib/components/v2/CollectionDetail/CollectionDescription.svelte';
	import FilterAndGrid from '$lib/components/v2/CollectionDetail/FilterAndGrid.svelte';
	import PrimaryButton from '$lib/components/v2/PrimaryButton/PrimaryButton.svelte';

	export let data;

	let gridStyle: 'normal' | 'dense' | 'masonry' = 'normal';

	let searchPhrase: string;

	let collectionData: Collection;
	let nfts = [];
	let creatorData: UserData;
	let reachedEnd = false;
	let isLoading = false;
	let displayedNfts = [];

	let index = 1;
	const limit = 12;

	$: if (nfts.length > 0) {
		displayedNfts = nfts;
	}

	$: if (searchPhrase) {
		displayedNfts = filterNfts(nfts, searchPhrase.toLocaleUpperCase());
	} else {
		displayedNfts = nfts;
	}

	const resetNfts = () => {
		nfts = [];
		index = 1;
		reachedEnd = false;
		isLoading = false;
	};

	let fetchFunction = async () => {
		const res = {} as FetchFunctionResult;
		res.res = await apiGetCollectionBySlug($page.params.collectionSlug, limit, index);
		res.adapted = await Promise.all(res.res.nfts?.map(nftToCardOptions)).catch((err) => {
			console.error(err);
			return [];
		});

		return res;
	};

	async function fetchMore() {
		if (reachedEnd || isLoading) return;
		isLoading = true;

		const res = await fetchFunction();

		if (res.err) {
			console.error(res.err);
			notifyError('Failed to fetch more collections.');
			return;
		}

		if (res.adapted?.length === 0) {
			reachedEnd = true;
		} else {
			nfts = [...nfts, ...res.adapted];
			index++;
		}

		isLoading = false;
	}

	async function fetchCollectionData() {
		resetNfts();
		collectionData = await apiGetCollectionBySlug($page.params.collectionSlug).catch((e) => null);
		creatorData = await fetchProfileData(collectionData?.creator).catch((e) => null);
		await fetchMore();
	}

	$: $page.params.collectionSlug && fetchCollectionData();

	onMount(async () => {
		await fetchMore();
	});
</script>

{#if data.collection}
	<MetaTags
		title={data.collection?.name + ' - Collection | Hinata Marketplace'}
		description={data.collection?.description}
		canonical={'https://hinata.io/' + data.collection?.slug}
		openGraph={{
			type: 'website',
			url: 'https://hinata.io/' + data.collection?.slug,
			title: data.collection?.name + ' - Collection | Hinata Marketplace',
			description: data.collection?.description,
			images: [
				{
					url: data.collection?.backgroundImageUrl,
					width: 800,
					height: 400,
					alt: data.collection?.name + 'Collection banner image.',
				},
			],
			site_name: 'Hinata',
		}}
	/>
{/if}

<main class="px-36 pt-24 mx-auto text-white">
	<div class="w-full overflow-hidden h-96">
		{#if collectionData?.backgroundImageUrl}
			<img class="w-full h-full object-cover object-center" src={collectionData?.backgroundImageUrl} alt="Collection cover." />
		{:else}
			<div class="w-full h-full bg-gray-100" />
		{/if}
	</div>

	<div class="w-full flex flex-row flex-wrap overflow-auto gap-y-5 items-center justify-between mt-12">
		<CollectionIdentity {collectionData} {creatorData} />
		<CollectionValues {collectionData} />
	</div>

	<!-- Description and share button -->
	<CollectionDescription {collectionData} />

	<!-- Filter, search and grid selection-->
	<FilterAndGrid bind:searchPhrase bind:gridStyle bind:nfts />

	<!-- Filter panel and NFT grid -->
	<div class="w-full flex flex-row items-start gap-x-5 mt-6 ">
		<div class="w-full">
			{#if !isLoading && reachedEnd && displayedNfts.length === 0}
				<div class="">No results found.</div>
			{/if}

			<NftGrid options={displayedNfts} bind:gridStyle bind:reachedEnd bind:isLoading createNewNftBtn={'asd'} />

			<div class="mt-16 mb-20">
				{#if displayedNfts?.length > 0 && !reachedEnd && displayedNfts.length === nfts.length}
					<PrimaryButton on:click={fetchMore}>Load more</PrimaryButton>
				{/if}
			</div>
		</div>
	</div>
</main>
