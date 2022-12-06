<script lang="ts">
	import Tabs from '$lib/components/v2/Tabs/+page.svelte';
	let tabs: { title: string; route: string }[] = [
		{
			title: 'Collections',
			route: '/marketplace/collections',
		},
		{
			title: 'Active Listings',
			route: '/marketplace/listings',
		},
	];
</script>

<main class="mx-auto text-white pt-28 2xl:pt-32 px-28 2xl:px-36">
	<Tabs bind:tabs />
	<slot />
</main>
