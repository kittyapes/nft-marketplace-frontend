<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userAuthLoginPopupAdapter } from '$lib/components/auth/AuthLoginPopup/adapters/userAuthLoginPopupAdapter';
	import AuthLoginPopup from '$lib/components/auth/AuthLoginPopup/AuthLoginPopup.svelte';
	import WalletNotConnectedPopup from '$lib/components/WalletNotConnectedPopup.svelte';
	import { profileData, refreshProfileData } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { isAuthTokenExpired } from '$utils/auth/token';
	import { userRoles } from '$utils/auth/userRoles';
	import { setPopup } from '$utils/popup';
	import { walletConnected, walletDisconnected } from '$utils/wallet';

	// We are using a function to prevent reactivity race conditions
	function getAuthRequiredRoutes() {
		return [RegExp('admin.*'), RegExp('create.*'), RegExp('profile/edit')];
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
		const walletRequiredRoutes = getWalletRequiredRoutes();
		const isWalletRequired = walletRequiredRoutes.some((route) => route.test(path));

		return isWalletRequired && !$currentUserAddress;
	}

	function setLoginPopup(onSuccessRedirect?: string) {
		const onLoginSuccess = () => {
			onSuccessRedirect && goto(onSuccessRedirect);
			refreshProfileData();
		};

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
		if (!to?.pathname) {
			return;
		}

		if (isConnectionRequired(to.pathname)) {
			cancel();
			setWalletConnectionPopup(to.pathname);
		}

		if ($walletConnected && isProtectedAndExpired(to.pathname)) {
			cancel();
			setLoginPopup(to.pathname);
		}

		// When the user is trying to access his profile and the the profile has not been created on the backend,
		// request him to sign in, which will create the profile.
		if (to.pathname === '/profile' || RegExp(`profile/${$currentUserAddress}`).test(to.pathname)) {
			if (!$profileData) {
				cancel();
				setPopup(AuthLoginPopup, {
					unique: true,
					props: {
						adapter: userAuthLoginPopupAdapter,
						onLoginSuccess: async () => {
							await refreshProfileData();
							goto('/profile');
						}
					}
				});
			}
		}
	});

	// Handler for when the app is first loaded on a auth protected route
	afterNavigate(({ to }) => {
		const unsub = currentUserAddress.subscribe(async (address) => {
			if (!address) return;

			if (isProtectedAndExpired(to.pathname)) {
				unsub();
				await goto('/');
				setLoginPopup(to.pathname);
			}
		});

		// Restrict create route to verified creators
		if (to.pathname.match(/create*/)) {
			profileData.subscribe((profile) => {
				if (profile && profile.status !== 'VERIFIED' && !profile.roles.includes('superadmin')) goto('/');
			});
		}
	});

	$: if ($walletDisconnected && isConnectionRequired($page.url.pathname)) {
		goto('/');
	}

	userRoles.subscribe((roles) => {
		if (!roles) return;

		// If the user is not an admin and tyring to access admin routes, redirect to the home page
		if ($page.url.pathname.startsWith('/admin') && !roles.includes('admin') && !roles.includes('superadmin')) {
			goto('/');
		}
	});
</script>
