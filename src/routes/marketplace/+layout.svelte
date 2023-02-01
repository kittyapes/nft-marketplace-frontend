<script lang="ts">
	import Tabs from '$lib/components/v2/Tabs/+page.svelte';
	let tabs: { title: string; route: string }[] = [
		{
			title: 'Listings',
			route: '/marketplace/listings',
		},
		{
			title: 'Collections',
			route: '/marketplace/collections',
		},
		{
			title: 'Creators',
			route: '/marketplace/creators',
		},
	];
</script>

<main class="text-white pt-28 2xl:pt-32 px-28 2xl:px-36">
	<Tabs bind:tabs />
	<slot />
</main>
