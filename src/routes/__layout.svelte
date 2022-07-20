<script context="module">
	export const load = async ({ url }) => ({
		props: {
			url: url.href
		}
	});
</script>

<script lang="ts">
	import '$styles/app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { onMount } from 'svelte';
	import { refreshConnection } from '$utils/wallet/connectWallet';
	import Toast from '$lib/components/toast/index.svelte';
	import PopupManager from '$utils/popup/PopupManager.svelte';
	import NavigationHandlers from '$lib/utils/NavigationHandlers.svelte';
	import ErrorManager from '$lib/components/ErrorManager.svelte';
	import ErrorPage from '$lib/components/ErrorPage.svelte';
	import { currentError } from '$stores/error';
	import { appDataToTriggerReload } from '$stores/wallet';

	export let url;

	onMount(async () => {
		// Check for whether user has access/has provided password
		if (import.meta.env.VITE_LOCK_SITE === 'true') {
			if (localStorage.getItem('ewjbasdjasdjhewh') !== 'true' && prompt('Enter password to continue') !== import.meta.env.VITE_SITE_PASSWORD) {
				return window.location.replace('https://hinata.foundation');
			}
			localStorage.setItem('ewjbasdjasdjhewh', 'true');
		}
		// Keep connection live as long as cachedProvider is present (even after reloads)
		await refreshConnection();
	});
</script>

<svelte:head>
	<title>Hinata</title>
</svelte:head>
{#key $appDataToTriggerReload}
	<Nav />
	{#if $currentError}
		<ErrorPage />
	{:else}
		<!-- <PageTransition {url}> -->
		<div class="pt-16 mx-auto">
			<slot />
		</div>
		<!-- </PageTransition> -->
	{/if}

	<Footer />
	<Toast />
	<PopupManager />
	<ErrorManager />
	<NavigationHandlers />
{/key}
