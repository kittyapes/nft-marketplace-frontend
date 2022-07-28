<script lang="ts">
	import '$styles/app.css';

	// Local Build Scripts
	import walletsScript from '$scripts/js/wallets.js?url';

	// Imports from Unpkg
	import torusScript from '$scripts/js/torus.umd.min.js?url';
	import walletConnectScript from '$scripts/js/walletconnect.umd.min.js?url';

	import ErrorPage from '$lib/components/ErrorPage.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Toast from '$lib/components/toast/index.svelte';
	import NavigationHandlers from '$lib/utils/NavigationHandlers.svelte';
	import { appDataToTriggerReload } from '$stores/wallet';
	import PopupManager from '$utils/popup/PopupManager.svelte';
	import { refreshConnection } from '$utils/wallet/connectWallet';
	import { onMount } from 'svelte';
	import { setContext } from 'svelte';
	import { afterNavigate } from '$app/navigation';

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

	let navigationErrorCode: number = null;
	let passedUpErrorCode: number = null;

	setContext('layout-stuff', {
		setErrorCode: (code: number) => {
			passedUpErrorCode = code;
		}
	});

	afterNavigate(() => {
		passedUpErrorCode = null;
	});

	$: errorCode = navigationErrorCode || passedUpErrorCode;
</script>

<svelte:head>
	<title>Hinata</title>
	<script src={walletConnectScript}></script>
	<script src={torusScript}></script>
	<script src={walletsScript}></script>
</svelte:head>

{#key $appDataToTriggerReload}
	<Nav />

	{#if errorCode}
		<ErrorPage {errorCode} />
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
	<NavigationHandlers bind:errorCode={navigationErrorCode} />
{/key}
