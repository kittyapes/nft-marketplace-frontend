<script lang="ts">
	import { page } from '$app/stores';
	import Tabs from '$lib/components/v2/Tabs/+page.svelte';

	let tabs: { title: string; route: string }[] = [
		{
			title: 'Collections',
			route: `/search/collections`,
		},
		{
			title: 'NFTs',
			route: `/search/nfts`,
		},
		{
			title: 'Creators',
			route: `/search/creators`,
		},
	];
</script>

<main class="mx-auto w-full text-white pt-32 px-40">
	<Tabs bind:tabs extWrapperClass={'w-full text-left'} />
	<slot />
</main>
