<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userAuthLoginPopupAdapter } from '$lib/components/auth/AuthLoginPopup/adapters/userAuthLoginPopupAdapter';
	import AuthLoginPopup from '$lib/components/auth/AuthLoginPopup/AuthLoginPopup.svelte';
	import WalletNotConnectedPopup from '$lib/components/WalletNotConnectedPopup.svelte';
	import { currentError } from '$stores/error';
	import { profileData, refreshProfileData } from '$stores/user';
	import { currentUserAddress } from '$stores/wallet';
	import { isAuthTokenExpired } from '$utils/auth/token';
	import { userRoles } from '$utils/auth/userRoles';
	import { setPopup } from '$utils/popup';
	import { walletDisconnected } from '$utils/wallet';

	// TODO: this whole file needs refactoring

	// We are using a function to prevent reactivity race conditions
	function getAuthRequiredRoutes() {
		return [RegExp('admin.*'), RegExp('create.*'), RegExp('profile/edit'), RegExp('management.*'), RegExp('collections/new/edit'), RegExp('marketplace.*')];
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

		// with the new approach to ask for sign whenever needed on an API call, this may not be needed
		/*if ($walletConnected && isProtectedAndExpired(to.pathname)) {
			cancel();
			setLoginPopup(to.pathname);
		}*/

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
	afterNavigate(({ from, to }) => {
		// with the new approach to ask for sign whenever needed on an API call, this may not be needed
		/*const unsub = currentUserAddress.subscribe(async (address) => {
			if (!address) return;

			if (isProtectedAndExpired(to.pathname)) {
				unsub();
				await goto('/');
				setLoginPopup(to.pathname);
			}
		});*/

		// Restrict routes to verified creators
		if (to.pathname.match(/create*/) || to.pathname === '/collections/new/edit') {
			profileData.subscribe((profile) => {
				if (profile && (profile.status !== 'VERIFIED' || !profile.roles.includes('verified_user')) && !profile.roles.includes('superadmin')) {
					console.log(from?.pathname, '->', to?.pathname);
					console.log('WRONG');
					currentError.set(403);
				}
			});
		}

		// Pages only accessible by superadmins
		if (to.pathname.match(/management*/)) {
			profileData.subscribe((profile) => {
				if (profile && !profile.roles.includes('superadmin') && !profile.roles.includes('admin')) {
					currentError.set(403);
				}
			});
		}
	});

	$: if ($walletDisconnected && isConnectionRequired($page.url.pathname)) {
		goto('/');
	}

	userRoles.subscribe((roles) => {
		if (!roles) return;

		// If the user is not an admin and trying to access admin routes, redirect to the home page
		if ($page.url.pathname.startsWith('/admin') && !roles.includes('admin') && !roles.includes('superadmin')) {
			currentError.set(403);
		}
	});
</script>
