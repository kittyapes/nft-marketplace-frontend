<script lang="ts">
	import '$styles/app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { onMount } from 'svelte';
	import { refreshConnection } from '$utils/wallet/connectWallet';
	import Toast from '$lib/components/toast/index.svelte';

	onMount(async () => {
		// Keep connection live as long as cachedProvider is present (even after reloads)
		await refreshConnection();
	});
</script>

<svelte:head>
	<title>Hinata</title>
</svelte:head>

<Nav />
<div class="pt-16">
	<slot />
</div>
<Footer />
<Toast />
