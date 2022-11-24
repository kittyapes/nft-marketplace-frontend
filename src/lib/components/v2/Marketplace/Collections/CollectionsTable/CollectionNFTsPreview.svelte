<script lang="ts">
	import type { FetchFunctionResult } from '$interfaces/fetchFunctionResult';
	import type { CardOptions } from '$interfaces/ui';
	import type { UserData } from '$interfaces/userData';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { nftToCardOptions } from '$utils/adapters/cardOptions';
	import { apiGetCollectionBySlug, type Collection } from '$utils/api/collection';
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';

	let nfts: CardOptions[] = [];
	let isLoading = false;
	let reachedEnd = false;
	let index = 1;
	export let collectionSlug: string;
	const limit = 15;

	let fetchFunction = async () => {
		const res = {} as FetchFunctionResult;
		res.res = await apiGetCollectionBySlug(collectionSlug, limit, index);
		res.adapted = await Promise.all(res.res.nfts?.map(nftToCardOptions)).catch((err) => {
			console.error(err);
			return [];
		});

		return res;
	};

	let lastScrollLeft = 0;
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
	const handleScroll = async (e) => {
		if (e?.currentTarget?.scrollLeft < lastScrollLeft) return;
		lastScrollLeft = e?.currentTarget?.scrollLeft <= 0 ? 0 : e?.currentTarget?.scrollLeft;
		if (e?.currentTarget?.scrollLeft + e?.currentTarget?.offsetWidth >= e?.currentTarget?.scrollWidth) {
			await fetchMore();
		}
	};
</script>

<div
	on:scroll={(e) => {
		handleScroll(e);
	}}
	class="w-[413px] 2xl:w-[515px] flex flex-row items-center gap-x-3 2xl:gap-x-4  overflow-x-auto overflow-y-hidden mb-5 2xl:mb-6"
>
	{#if nfts?.length > 0}
		{#each nfts as nft}
			<div
				class="relative min-h-[64px] 2xl:min-h-[80px] min-w-[64px] 2xl:min-w-[80px] background thumbnail bg-cover flex flex-row items-end justify-center"
				style="--url: url({nft?.nfts?.[0]?.thumbnailUrl ?? ''})"
			>
				<div class="bg-black bg-opacity-40 px-1.5 py-px text-[10px] 2xl:text-xs ">
					{nft?.listingData?.shortDisplayPrice || '0.00'} ETH
				</div>
			</div>
		{/each}
	{/if}
	{#if isLoading}
		<div class="flex items-center max-h-[64px] 2xl:max-h-[80px]">
			<DiamondsLoader />
		</div>
	{/if}
</div>

<style lang="postcss">
	.thumbnail {
		background-image: var(--url);
	}
</style>
