<script lang="ts">
	import Search from '$icons/search.svelte';
	import { debounce } from 'lodash-es';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { getCollectionsByTitle, getListingsByTitle, getUsersByName } from '$utils/api/search/globalSearch';
	import type { SearchResults } from 'src/interfaces/search/searchResults';
	import { reject } from 'lodash-es';
	import Loader from '$icons/loader.svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { outsideClickCallback } from '$actions/outsideClickCallback';
	import { goto } from '$app/navigation';
	import VerifiedBadge from '$icons/verified-badge.svelte';
	import { isAuthTokenExpired } from '$utils/auth/token';
	import { currentUserAddress } from '$stores/wallet';
	import { setPopup } from '$utils/popup';
	import AuthLoginPopup from './auth/AuthLoginPopup/AuthLoginPopup.svelte';
	import { userAuthLoginPopupAdapter } from './auth/AuthLoginPopup/adapters/userAuthLoginPopupAdapter';
	import axios from 'axios';
	import { adaptListingToNftCard } from '$utils/adapters/adaptListingToNftCard';
	import { searchQuery } from '$stores/search';

	let query: string;
	let searching = false;
	let show = false;

	const resultCategoryLimit = 3;

	let searchResults: SearchResults = {
		collections: [],
		listings: [],
		users: []
	};

	const debouncedSearch = debounce(async () => {
		await searchGlobally();
	}, 500);

	const searchListings = async (query: string) => {
		getListingsByTitle(query, resultCategoryLimit)
			.then(async (response) => {
				let listings = response;
				searchResults.listings = await Promise.all(listings.map(adaptListingToNftCard));
			})
			.catch((e) => notifyError(e.message));
	};

	const searchUsers = async (query: string) => {
		getUsersByName(query, resultCategoryLimit)
			.then(async (response) => {
				searchResults.users = response;
			})
			.catch((e) => notifyError(e.message));
	};

	const searchCollections = async (query: string) => {
		getCollectionsByTitle(query, resultCategoryLimit)
			.then(async (response) => {
				searchResults.collections = response.filter((e) => e.slug);
			})
			.catch((e) => notifyError(e.message));
	};

	const searchGlobally = async () => {
		await searchListings(query).catch((error) => console.log(error));
		await searchUsers(query).catch((error) => console.log(error));
		await searchCollections(query).catch((error) => console.log(error));

		console.log(searchResults);
		await tick();
		$searchQuery = query;
		show = true;
	};

	$: if (!query) {
		searching = false;
		debouncedSearch.cancel();
	}

	$: if (searching) {
		show = false;
	}

	$: if (query) {
		searching = true;
		debouncedSearch();
	}

	const preload = async (src) => {
		try {
			console.log(src);
			const res = await axios.get(src);
			const blob = await new Blob(res.data);

			return new Promise(function (resolve) {
				let reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onload = () => {
					resolve(reader.result);
				};
				reader.onerror = (error) => reject(`Error: ${error}`);
			});
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div
	class="flex py-2 px-4 items-center gap-x-4 border border-black border-opacity-30 rounded-md flex-grow-[0.1] relative overflow-visible z-30 {$$props.class}"
	use:outsideClickCallback={{
		cb: () => (searching = false)
	}}
>
	<Search />
	<input bind:value={query} type="text" class="w-72 focus:outline-none" placeholder="Search nfts, collections, and artists" />
	{#if searching}
		<div class="w-full bg-white top-16 right-0 border-black border-opacity-30 rounded-md border z-30 absolute" in:fly={{ y: -40, duration: 300 }}>
			{#if show}
				{#each Object.keys(searchResults) as section}
					{#if searchResults[section].length > 0}
						<div class="">
							<div class="first-letter:uppercase font-semibold text-sm p-4">{section}</div>
							<div class="border-b border-black border-opacity-30" />
							<div class="p-4 flex flex-col gap-4">
								{#each searchResults[section] as result}
									{#if section === 'listings'}
										<div class="flex gap-4 items-center btn" on:click={() => setPopup(result.popupComponent, { props: { options: result.popupOptions } })}>
											{#if result.imageUrl}
												<div class="w-12 h-12 rounded-full grid place-items-center">
													<div class="w-12 h-12 rounded-full bg-cover" style="background-image: url({result.imageUrl})" />
												</div>
											{/if}
											<div class="font-semibold w-full max-w-full">
												{#if result.title?.length > 25}
													{result.title.slice(0, 25)}...
												{:else}
													{result.title}
												{/if}
											</div>
										</div>
									{:else if section === 'users'}
										<div
											class="flex gap-4 items-center btn"
											on:click={() => {
												searching = false;
												goto('/profile/' + result.address);
											}}
										>
											{#if result.thumbnailUrl}
												<div class="w-12 h-12 rounded-full grid place-items-center">
													<div class="w-12 h-12 bg-cover rounded-full" style="background-image: url({result.thumbnailUrl})" />
												</div>
											{/if}
											<div class="">
												<div class="font-semibold username w-full max-w-full">
													{#if result.username?.length > 25}
														{result.username.slice(0, 25)}...
													{:else}
														{result.username}
													{/if}
												</div>
											</div>
											{#if result.roles?.includes('verified_user')}
												<VerifiedBadge />
											{/if}
										</div>
									{:else if section === 'collections'}
										<div
											class="flex gap-4 items-center btn"
											on:click={() => {
												searching = false;
												goto('/collections/' + result.slug);
											}}
										>
											{#if result.logoImageUrl}
												<div class="w-12 h-12 rounded-full grid place-items-center">
													<div class="w-12 h-12 rounded-full bg-cover" style="background-image: url({result.logoImageUrl})" />
												</div>
											{/if}
											<div class="font-semibold w-full max-w-full">
												{#if result.name?.length > 25}
													{result.name?.slice(0, 25)}...
												{:else}
													{result.name}
												{/if}
											</div>
										</div>
									{/if}
								{/each}
							</div>
						</div>
					{/if}
				{/each}
				{#if Object.values(searchResults).filter((e) => e.length > 0).length > 0}
					<div class="p-4">
						<button
							class="btn btn-rounded w-full border-2 btn-gradient-border"
							on:click={() => {
								show = false;
								searching = false;
								goto('/search');
							}}
						>
							All results
						</button>
					</div>
				{:else}
					<div class="p-4 text-lg font-semibold">Nothing found</div>
				{/if}
			{:else}
				<Loader />
			{/if}
		</div>
	{/if}
</div>
