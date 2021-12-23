<script lang="ts">
	import '$styles/app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { onMount } from 'svelte';
	import { refreshConnection } from '$utils/wallet/connectWallet';
	import Toast from '$lib/components/toast/index.svelte';
	import PopupManager from '$utils/popup/PopupManager.svelte';

	// Login Popup
	import { browser } from '$app/env';
	import AdminLoginPopup from '$lib/components/AdminLoginPopup.svelte';
	import { setPopup } from '$utils/popup';
	import { page } from '$app/stores';
	import pathIsProtected from '$utils/pathIsProtected';
	import { isAuthExpired } from '$utils/api';

	onMount(async () => {
		// Keep connection live as long as cachedProvider is present (even after reloads)
		await refreshConnection();
	});

	$: pathIsProtected($page.path) && browser && isAuthExpired() && setPopup(AdminLoginPopup);
</script>

<svelte:head>
	<title>Hinata</title>
</svelte:head>

<Nav />
<div class="pt-16 mx-auto">
	<slot />
</div>
<Footer />
<Toast />

<PopupManager />
