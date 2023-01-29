<script lang="ts">
	import { page } from '$app/stores';
	import Tabs from '$lib/components/v2/Tabs/+page.svelte';

	let tabs: { title: string; route: string }[] = [
		{
			title: 'Collections',
			route: `/search/collections?${$page.url?.searchParams}`,
		},
		{
			title: 'NFTs',
			route: `/search/nfts?${$page.url?.searchParams}`,
		},
		{
			title: 'Users',
			route: `/search/users?${$page.url?.searchParams}`,
		},
	];
</script>

<main class="mx-auto w-full text-white pt-32 px-40">
	<Tabs bind:tabs extWrapperClass={'w-full text-left'} />
	<slot />
</main>
