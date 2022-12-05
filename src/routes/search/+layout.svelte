<script>
	import { page } from '$app/stores';
</script>

<main class="mx-auto text-white pt-28 2xl:pt-32 px-28 2xl:px-36">
	<h1 class="font-semibold text-gradient text-xl 2xl:text-2xl leading-5 2xl:leading-6">
		{#if $page?.url?.pathname === '/search/collections'}
			Collections
		{:else if $page?.url?.pathname === '/search/users'}
			Users
		{:else if $page?.url?.pathname === '/search/nfts'}
			NFTs
		{/if}
	</h1>
	<slot />
</main>
