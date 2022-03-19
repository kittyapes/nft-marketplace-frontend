import { browser } from '$app/env';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { setPopup } from '$utils/popup';
import { WalletState, walletState } from '$utils/wallet';
import { derived } from 'svelte/store';
import { currentUserAddress } from '$stores/wallet';
import { getAddress } from '$utils/misc/getters';

// @ts-ignore
import AuthLoginPopup from '$lib/components/auth/AuthLoginPopup/AuthLoginPopup.svelte';
import { userAuthLoginPopupAdapter } from '$lib/components/auth/AuthLoginPopup/adapters/userAuthLoginPopupAdapter';
import { getAuthToken } from '$utils/auth/token';

// Regex of routes which are allowed to be accessed only with a
// wallet connected.
export const walletRequiredRoutes = [/\/profile\/edit/];

// Regex of routes which are allowed to be accessed only by authenticated users.
export const authRequiredRoutes = [/\/admin.*/];

export function matchesRouteIn(routes: RegExp[], path: string) {
	return routes.some((route) => route.test(path));
}

// Initializes handlers we need for changing routes
// when the wallet state changes. For example, user must be
// redirected to the home screen if they are viewing certain routes
// and the wallet becomes disconnected.
export function initNavigationHandlers() {
	// Redirecting to home, if the wallet is disconnected
	const shouldRedirectHome = derived([page, walletState], ([$page, $walletState]) => {
		// Connected or unknown, because we do not wanna immedietely redirect when the app is
		// still loading
		if ($walletState !== WalletState.DISCONNECTED) {
			return false;
		}

		const match = walletRequiredRoutes.find((route) => $page.path.match(route));

		if (match) {
			return true;
		}

		return false;
	});

	shouldRedirectHome.subscribe((shouldRedirect) => shouldRedirect && browser && goto('/'));

	// Auth popup should be shown if a route requires authentication
	derived([page, currentUserAddress], ([$page]) => [$page]).subscribe(([$page]) => {
		if (!getAddress()) {
			return;
		}

		if (matchesRouteIn(authRequiredRoutes, $page.path) && !getAuthToken()) {
			setPopup(AuthLoginPopup, {
				props: { adapter: userAuthLoginPopupAdapter },
				onClose: () => {
					if (!getAuthToken()) {
						goto('/');
					}
					return true;
				},
				unique: true
			});
		}
	});
}

export function goBack() {
	window.history.back();
}
