<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { userAuthLoginPopupAdapter } from '$lib/components/auth/AuthLoginPopup/adapters/userAuthLoginPopupAdapter';
	import AuthLoginPopup from '$lib/components/auth/AuthLoginPopup/AuthLoginPopup.svelte';
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

	function setLoginPopup(onSuccessRedirect?: string) {
		const onLoginSuccess = () => goto(onSuccessRedirect);

		setPopup(AuthLoginPopup, {
			unique: true,
			props: { adapter: userAuthLoginPopupAdapter, onLoginSuccess }
		});
	}

	// Handler for when the user is already in the app and is about
	// to navigate to a protected route
	beforeNavigate(({ to, cancel }) => {
		if (!to) {
			return;
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
