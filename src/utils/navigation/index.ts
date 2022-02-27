import { browser } from '$app/env';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { WalletState, walletState } from '$utils/wallet';
import { derived } from 'svelte/store';

// Regex of routes which are allowed to be accessed only with a
// wallet connected.
export const walletRequiredRoutes = [/\/profile\/edit/];

// Initializes handlers we need for changing routes
// when the wallet state changes. For example, user must be
// redirected to the home screen if they are viewing certain routes
// and the wallet becomes disconnected.
export function initNavigationHandlers() {
	const shouldRedirectHome = derived([page, walletState], ([$page, $walletState]) => {
		// Connected or unknown, to not immedietly redirect when the app is
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
}

export function goBack() {
	window.history.back();
}
