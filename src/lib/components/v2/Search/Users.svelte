<script lang="ts">
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { globalUsersSearch } from '$utils/api/search/globalSearch';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';
	import type { UserData } from '$interfaces/userData';
	import FeaturedArtistCard from '$lib/components/FeaturedArtistCard.svelte';
	import { goto } from '$app/navigation';

	let users: Partial<UserData>[] = [];
	let query: string;
	let reachedEnd = false;
	let isLoading = true;
	let pageNumber = 1;

	const limit = 10;

	const inviewOptions = {};

	const fetchFunction = async () => {
		const res = await globalUsersSearch($page?.url?.searchParams?.get('query'), limit, pageNumber);

		return res.users;
	};

	async function fetchMore() {
		if (reachedEnd || query) return;
		isLoading = true;

		const res = await fetchFunction();

		console.log(res);

		if (res.err) {
			notifyError('Failed to fetch more users.');
			return;
		}

		if (res.length === 0) {
			reachedEnd = true;
		} else {
			users = [...users, ...res];
			pageNumber++;
		}

		isLoading = false;
	}

	function onChange(event) {
		if (event.detail.inView) {
			fetchMore();
		}
	}

	onMount(async () => {
		await fetchMore();
	});
</script>

{#if isLoading}
	<div class="w-full">
		<DiamondsLoader />
	</div>
{:else if users?.length === 0 && !isLoading}
	<p class="p-36 whitespace-nowrap font-semibold text-lg opacity-70">Nothing to see here, move along.</p>
{/if}

<div class="my-6 2xl:my-8 w-full grid 2xl:grid-cols-2 justify-evenly gap-8">
	{#each users as user}
		<FeaturedArtistCard
			on:click={() => goto(`/profile/${user.address}`)}
			creatorData={{
				name: user.username,
				address: user.address,
				coverImg: user.coverUrl,
				profileImg: user.thumbnailUrl,
				created: 0,
			}}
			includeCreatedNumber={false}
		/>
	{/each}

	{#if users?.length > 0 && !isLoading}
		<div use:inview={inviewOptions} on:change={onChange} />
	{/if}
</div>
