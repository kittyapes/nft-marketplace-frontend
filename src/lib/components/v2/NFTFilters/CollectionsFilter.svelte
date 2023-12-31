<script lang="ts">
	import HinataBadge from '$icons/hinata-badge.svelte';
	import Search from '$icons/search.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { apiSearchCollections, type Collection } from '$utils/api/collection';
	import { onMount } from 'svelte';
	import Input from '../Input/Input.svelte';
	import { toShortDisplayPrice } from '$utils/adapters/cardOptions';

	const dispatch = createEventDispatcher();

	let limit = 0;
	let pageNumber = 0;
	let collections: Collection[] = [];

	let fetchingCollections = false;
	let searchPhrase = '';

	onMount(async () => {
		await loadCollections();
	});

	const loadCollections = async () => {
		fetchingCollections = true;
		limit += 10;
		pageNumber++;
		const loadedCollections = (await apiSearchCollections({ limit, page: pageNumber })).collections;
		collections = [...collections, ...loadedCollections];
		fetchingCollections = false;
	};

	$: if (searchPhrase) {
		fetchingCollections = true;
		setTimeout(async () => {
			collections = (await apiSearchCollections({ limit, name: searchPhrase })).collections;
			fetchingCollections = false;
		}, 500);
	}

	$: if (!searchPhrase) {
		collections = [];
		loadCollections();
	}
</script>

<Input
	bind:value={searchPhrase}
	class="relative rounded-none border-2 bg-gradient-a border-gradient hover:text-white w-full h-12"
	placeholder="Search by collections"
>
	<div class="ml-4 grid place-items-center">
		<Search class="w-5 h-6" />
	</div>
</Input>

{#if collections?.length > 0}
	<div class="flex flex-col gap-y-8 2xl:gap-y-10 mt-6 2xl:mt-7">
		{#each collections as collection}
			<button
				on:click={() => {
					console.log(collection);
					$page.url.searchParams.set('collections', collection?.collectionAddress);
					goto(`?${$page.url.searchParams}`);
					dispatch('request-refresh');
				}}
				class="flex flex-row items-center gap-x-4 2xl:gap-x-6 font-bold text-white text-xs 2xl:text-sm"
			>
				<div
					class="relative w-14 h-14 border-gradient thumbnail bg-cover bg-center flex-shrink-0"
					style="--url: url({collection?.logoImageUrl ?? ''})"
				>
					<HinataBadge
						class="absolute -bottom-2.5 -right-2.5 z-10  w-5 h-5 {collection.mintedFrom !== 'HINATA'
							? 'hidden'
							: ''}"
					/>
				</div>

				<div class="flex-grow whitespace-nowrap truncate">
					<div class="flex flex-row items-center justify-between gap-x-2 max-w-full">
						<h2 class="truncate">{collection?.name}</h2>

						<h2>
							{toShortDisplayPrice(
								`${collection?.stats?.localTotalVol + collection?.stats?.externalTotalVol}`,
							)} ETH
						</h2>
					</div>

					<div
						class="flex flex-row items-center justify-between font-semibold leading-7 2xl:leading-9 text-[#CECECE]"
					>
						<h3 class="">Floor: {collection?.stats?.localFloorPrice ?? 0} ETH</h3>

						<h3>
							~${toShortDisplayPrice(`${collection?.stats?.localFloorPrice * 1850}`) ?? 0}
						</h3>
					</div>
				</div>
			</button>
		{/each}
	</div>
{/if}

{#if fetchingCollections}
	<DiamondsLoader />
{/if}

{#if collections?.length > 0}
	<button
		on:click={async () => await loadCollections()}
		class="w-full flex items-center justify-center bg-gradient-a border-gradient h-11 2xl:h-14 mt-7 2xl:mt-9"
	>
		Load more
	</button>
{/if}
