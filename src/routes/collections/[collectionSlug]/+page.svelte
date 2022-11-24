<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import type { UserData } from '$interfaces/userData';
	import ActionMenu from '$lib/components/ActionMenu.svelte';
	import AttachToElement from '$lib/components/AttachToElement.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { nftToCardOptions } from '$utils/adapters/cardOptions';
	import { apiGetCollectionBySlug, type Collection } from '$utils/api/collection';
	import { fetchProfileData } from '$utils/api/profile';
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import CollectionDetail from '$lib/components/v2/CollectionDetail/+page.svelte';
	export let data;

	let collectionData: Collection;
	let nfts = [];
	let creatorData: UserData;
	let reachedEnd = false;
	let isLoading = false;

	let index = 1;
	const limit = 12;

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

	onMount(async () => {
		await fetchMore();
	});

	async function fetchCollectionData() {
		resetNfts();
		collectionData = await apiGetCollectionBySlug($page.params.collectionSlug).catch((e) => undefined);
		creatorData = await fetchProfileData(collectionData?.creator).catch((e) => undefined);
		await fetchMore();
	}

	$: $page.params.collectionSlug && fetchCollectionData();
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
<CollectionDetail bind:collectionData bind:nfts on:load-more={fetchMore} bind:isLoading bind:reachedEnd />
