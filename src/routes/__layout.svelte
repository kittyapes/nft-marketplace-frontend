<script lang="ts">
	import '$styles/app.css';

	// Local Build Scripts
	import walletsScript from '$scripts/js/wallets.js?url';

	// Imports from Unpkg
	import walletConnectScript from '$scripts/js/walletconnect.umd.min.js?url';
	import torusScript from '$scripts/js/torus.umd.min.js?url';

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
	<script src={walletConnectScript}></script>
	<script src={torusScript}></script>
	<script src={walletsScript}></script>
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
