<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { userAuthLoginPopupAdapter } from '$lib/components/auth/AuthLoginPopup/adapters/userAuthLoginPopupAdapter';
	import AuthLoginPopup from '$lib/components/auth/AuthLoginPopup/AuthLoginPopup.svelte';
	import WalletNotConnectedPopup from '$lib/components/WalletNotConnectedPopup.svelte';
	import { currentUserAddress } from '$stores/wallet';
	import { isAuthTokenExpired } from '$utils/auth/token';
	import { setPopup } from '$utils/popup';

	// We are using a function to prevent reactivity race conditions
	function getAuthRequiredRoutes() {
		return [RegExp('admin.*'), RegExp(`profile/${$currentUserAddress}`), RegExp('create.*')];
	}

	function isProtectedAndExpired(path: string) {
		const isProtectedRoute = getAuthRequiredRoutes().some((route) => route.test(path));
		const isTokenExpired = isAuthTokenExpired($currentUserAddress);

		return isProtectedRoute && isTokenExpired;
	}

	function getWalletRequiredRoutes() {
		return [RegExp('create.*')];
	}

	// Check if the path needs a wallet connected. If yes, check if the user is connected.
	function isConnectionRequired(path: string) {
		console.log('test');
		const walletRequiredRoutes = getWalletRequiredRoutes();
		const isWalletRequired = walletRequiredRoutes.some((route) => route.test(path));

		console.log({ isWalletRequired }, $currentUserAddress);

		return isWalletRequired && !$currentUserAddress;
	}

	function setLoginPopup(onSuccessRedirect?: string) {
		const onLoginSuccess = () => onSuccessRedirect && goto(onSuccessRedirect);

		setPopup(AuthLoginPopup, {
			unique: true,
			props: { adapter: userAuthLoginPopupAdapter, onLoginSuccess }
		});
	}

	function setWalletConnectionPopup(onSuccessRedirect?: string) {
		const onConnectSuccess = () => onSuccessRedirect && goto(onSuccessRedirect);

		setPopup(WalletNotConnectedPopup, {
			unique: true,
			props: { onConnectSuccess }
		});
	}

	// Handler for when the user is already in the app and is about
	// to navigate to a protected route
	beforeNavigate(({ to, cancel }) => {
		console.log(to?.pathname);
		// cancel();

		if (!to?.pathname) {
			return;
		}

		if (isConnectionRequired(to.pathname)) {
			cancel();
			setWalletConnectionPopup(to.pathname);
		}

		if (isProtectedAndExpired(to.pathname)) {
			cancel();
			setLoginPopup(to.pathname);
		}
	});

	// Handler for when the app is first loaded on a protected route
	afterNavigate(({ to }) => {
		const unsub = currentUserAddress.subscribe(async (address) => {
			if (!address) return;

			if (isProtectedAndExpired(to.pathname)) {
				unsub();
				await goto('/');
				setLoginPopup(to.pathname);
			}
		});
	});
</script>
