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
	import { isAuthExpired } from '$utils/api';

	// Aidrop popup
	import { setPopup } from '$utils/popup';
	import AirdropPopup from '$lib/components/airdrop/AirdropPopup.svelte';
	import type { AirdropPopupOptions } from '$constants/airdrops';
	import { currentUserAddress, userClaimsArray } from '$stores/wallet';
	import { ethers } from 'ethers';
	import { getAllTokenBalances } from '$utils/contracts/tokenBalances';

	onMount(async () => {
		// Keep connection live as long as cachedProvider is present (even after reloads)
		await refreshConnection();
	});

	let claimAmount = 0;
	let hasClaimed = false;
	const updateValues = (claims: ClaimsObject[]) => {
		if (claims) {
			hasClaimed =
				$userClaimsArray?.filter((claimsObj) => claimsObj.user.hasClaimed).length ===
				$userClaimsArray?.length;
			if (hasClaimed) {
				claimAmount = 0;
			} else {
				claimAmount = 0;
				$userClaimsArray.map((claimsObj) => {
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

	$: updateValues($userClaimsArray);

	$: pathIsProtected($page.path) && browser && isAuthExpired() && setPopup(AdminLoginPopup);

	$: ((userAddress: string) => userAddress && getAllTokenBalances(userAddress))(
		$currentUserAddress
	);
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

<PopupManager />
