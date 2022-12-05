<script lang="ts">
	import { notifyError } from '$utils/toast';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { globalUsersSearch } from '$utils/api/search/globalSearch';
	import UserGrid from '$components/v2/UserGrid/+page.svelte';
	import DiamondsLoader from '$lib/components/DiamondsLoader.svelte';
	import { inview } from 'svelte-inview';

	let users = [];
	let query: string;
	let reachedEnd = false;
	let isLoading = true;
	let pageNumber = 1;
	const limit = 10;

	const fetchFunction = async () => {
		const res = await globalUsersSearch($page?.url?.searchParams?.get('query'), limit, pageNumber);
		console.log(res);
		return res.verifiedCreators;
	};

	async function fetchMore() {
		if (reachedEnd || query) return;
		isLoading = true;

		const res = await fetchFunction();

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
	const inviewOptions = {};
	onMount(async () => {
		await fetchMore();
	});
</script>

<div class="my-6 2xl:my-8 w-full">
	<UserGrid bind:users bind:isLoading />
	{#if isLoading}
		<DiamondsLoader />
	{:else}
		<div use:inview={inviewOptions} on:change={onChange} />
	{/if}
</div>
