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
	// Aidrop popup
	import { setPopup } from '$utils/popup';
	import AirdropPopup from '$lib/components/airdrop/AirdropPopup.svelte';
	import type { AirdropPopupOptions } from '$constants/airdrops';
	import { currentUserAddress, communityClaimsArray } from '$stores/wallet';
	import { ethers } from 'ethers';
	import { getAllTokenBalances } from '$utils/contracts/tokenBalances';
	import NavigationHandlers from '$lib/utils/NavigationHandlers.svelte';
	import ErrorManager from '$lib/components/ErrorManager.svelte';
	import { currentError } from '$stores/error';
	import ErrorPage from '$lib/components/ErrorPage.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';

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
	// Airdrop Popup
	let claimAmount = 0;
	let hasClaimed = false;
	const updateValues = (claims: ClaimsObject[]) => {
		if (claims) {
			hasClaimed = $communityClaimsArray?.filter((claimsObj) => claimsObj.user.hasClaimed).length === $communityClaimsArray?.length;
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

	$: ((userAddress: string) => userAddress && getAllTokenBalances(userAddress))($currentUserAddress);
</script>

<svelte:head>
	<title>Hinata</title>
</svelte:head>
<Nav />
<!-- {#if $currentError}
	<ErrorPage />
{:else}
	<PageTransition {url}>
		<div class="pt-16 mx-auto">
			<slot />
		</div>
	</PageTransition>
{/if} -->

<div class="pt-16 mx-auto">
	<slot />
</div>

<Footer />
<Toast />
<PopupManager />
<ErrorManager />
<NavigationHandlers />
