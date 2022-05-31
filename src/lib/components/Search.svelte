<script lang="ts">
	import Search from '$icons/search.svelte';
	import { debounce } from 'lodash-es';
	import { notifyError, notifySuccess } from '$utils/toast';
	import { getCollectionsByTitle, getDropsByTitle, getUsersByName } from '$utils/api/search/globalSearch';
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

	let query: string;
	let searching = false;
	let show = false;

	let searchResults: SearchResults = {
		collections: [],
		drops: [],
		users: []
	};

	const debouncedSearch = debounce(async () => {
		await searchGlobally();
	}, 500);

	const searchDrops = async (query: string) => {
		getDropsByTitle(query)
			.then(async (response) => {
				searchResults.drops = response.slice(0, 3);
			})
			.catch((e) => notifyError(e.message));
	};

	const searchUsers = async (query: string) => {
		getUsersByName(query)
			.then(async (response) => {
				searchResults.users = response.slice(0, 3);
			})
			.catch((e) => notifyError(e.message));
	};

	const searchCollections = async (query: string) => {
		getCollectionsByTitle(query)
			.then(async (response) => {
				//searchResults.collections = response;
			})
			.catch((e) => notifyError(e.message));
	};

	const showResults = async () => {
		await tick();
		show = true;
	};

	const searchGlobally = async () => {
		await searchDrops(query).catch((error) => console.log(error));
		await searchUsers(query).catch((error) => console.log(error));
		await searchCollections(query).catch((error) => console.log(error));

		console.log(searchResults);
		showResults();
	};

	$: {
		if (!query) {
			searching = false;
			debouncedSearch.flush();
		}
	}

	$: if (searching) {
		show = false;
	}

	$: if (query) {
		if (isAuthTokenExpired($currentUserAddress)) {
			setPopup(AuthLoginPopup, { props: { onLoginSuccess: () => {}, adapter: userAuthLoginPopupAdapter } });
		} else {
			searching = true;
			debouncedSearch();
		}
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
	class="flex py-2 px-4 items-center gap-x-4 border border-black border-opacity-30 rounded-md flex-grow-[0.1] relative {$$props.class}"
	use:outsideClickCallback={{
		cb: () => (searching = false)
	}}
>
	<Search />
	<input bind:value={query} type="text" class="w-72 focus:outline-none" placeholder="Search nfts, collections, and artists" />
	{#if searching}
		<div class="absolute w-full bg-white top-14 left-0 border-black border-opacity-30 rounded-md border" in:fly={{ y: -40, duration: 300 }}>
			{#if show}
				{#each Object.keys(searchResults) as section}
					{#if searchResults[section].length > 0}
						<div class="">
							<div class="first-letter:uppercase font-semibold text-sm p-4">{section}</div>
							<div class="border-b border-black border-opacity-30" />
							<div class="p-4 flex flex-col gap-4">
								{#each searchResults[section] as result}
									{#if section === 'drops'}
										<div class="flex gap-4 items-center btn">
											{#if result.imageUrl}
												<div class="w-12 h-12 rounded-full grid place-items-center">
													{#await preload(result.imageUrl)}
														<Loader class="my-0 mx-0" />
													{:then}
														<div class="w-full h-full rounded-full" style="background-image: url({result.imageUrl})" />
													{/await}
												</div>
											{/if}
											<div class="font-semibold">{result.title}</div>
										</div>
									{:else if section === 'users'}
										<div
											class="flex gap-4 items-center btn"
											on:click={() => {
												searching = false;
												goto('/profile/' + result.address);
											}}
										>
											{#if result.imageUrl}
												<div class="w-12 h-12 rounded-full grid place-items-center">
													{#await preload(result.imageUrl)}
														<Loader class="my-0 mx-0" />
													{:then}
														<div class="w-full h-full bg-cover rounded-full" style="background-image: url({result.imageUrl})" />
													{/await}
												</div>
											{/if}
											<div class="">
												<div class="font-semibold username w-full max-w-full">
													{#if result.username.length > 25}
														{result.username.slice(0, 25)}...
													{:else}
														{result.username}
													{/if}
												</div>
											</div>
											{#if result.status === 'VERIFIED'}
												<VerifiedBadge />
											{/if}
										</div>
									{/if}
								{/each}
							</div>
						</div>
					{/if}
				{/each}
				{#if Object.values(searchResults).filter((e) => e.length > 0).length > 0}
					<div class="p-4">
						<button class="btn btn-rounded w-full border-2 btn-gradient-border">All results</button>
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
