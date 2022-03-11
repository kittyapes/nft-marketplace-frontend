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
	import { page } from '$app/stores';
	import pathIsProtected from '$utils/pathIsProtected';
	import { isAdminAuthExpired } from '$utils/api';
	// Aidrop popup
	import { setPopup } from '$utils/popup';
	import AirdropPopup from '$lib/components/airdrop/AirdropPopup.svelte';
	import type { AirdropPopupOptions } from '$constants/airdrops';
	import { currentUserAddress, communityClaimsArray } from '$stores/wallet';
	import { ethers } from 'ethers';
	import { getAllTokenBalances } from '$utils/contracts/tokenBalances';
	import { initNavigationHandlers } from '$utils/navigation';

	// Various navigation handlers such as functions to be called when
	// the wallet is disconnected, etc.
	initNavigationHandlers();

	onMount(async () => {
		// Check for whether user has access/has provided password
		if (import.meta.env.VITE_LOCK_SITE === 'true') {
			if (
				localStorage.getItem('ewjbasdjasdjhewh') !== 'true' &&
				prompt('Enter password to continue') !== import.meta.env.VITE_SITE_PASSWORD
			) {
				return window.location.replace('https://hinata.foundation');
			}
			localStorage.setItem('ewjbasdjasdjhewh', 'true');
		}
		// Keep connection live as long as cachedProvider is present (even after reloads)
		await refreshConnection();
	});
	// Airdrop Popup
	let claimAmount = 0;
	let hasClaimed = false;
	const updateValues = (claims: ClaimsObject[]) => {
		if (claims) {
			hasClaimed =
				$communityClaimsArray?.filter((claimsObj) => claimsObj.user.hasClaimed).length ===
				$communityClaimsArray?.length;
			if (hasClaimed) {
				claimAmount = 0;
			} else {
				claimAmount = 0;
				$communityClaimsArray.map((claimsObj) => {
					if (!claimsObj.user.hasClaimed) {
						claimAmount += +ethers.utils.formatEther(claimsObj.user.amount);
					}
				});
				let options = null;
				options =
					claimAmount > 0
						? ({
								eligibleOne: true,
								eligibleTwo: false,
								valueOne: +claimAmount.toFixed(2),
								valueTwo: 20000
						  } as AirdropPopupOptions)
						: null;
				options && setPopup(AirdropPopup, { props: { options } });
			}
		}
	};
	$: updateValues($communityClaimsArray);
	$: browser &&
		$currentUserAddress &&
		pathIsProtected($page.path) &&
		isAdminAuthExpired($currentUserAddress) &&
		setPopup(AdminLoginPopup);
	$: ((userAddress: string) => userAddress && getAllTokenBalances(userAddress))(
		$currentUserAddress
	);
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
