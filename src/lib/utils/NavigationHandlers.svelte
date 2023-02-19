<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { CardOptions } from '$interfaces/ui';
	import { userAuthLoginPopupAdapter } from '$lib/components/auth/AuthLoginPopup/adapters/userAuthLoginPopupAdapter';
	import AuthLoginPopup from '$lib/components/auth/AuthLoginPopup/AuthLoginPopup.svelte';
	import { openCardPopupFromOptions } from '$lib/components/CardPopup/CardPopup';
	import WalletNotConnectedPopup from '$lib/components/WalletNotConnectedPopup.svelte';
	import { profileData, refreshProfileData } from '$stores/user';
	import { connectionDetails, currentUserAddress } from '$stores/wallet';
	import { listingToCardOptions, nftToCardOptions } from '$utils/adapters/cardOptions';
	import { getListing, type ListingChainStatus, type ListingStatus } from '$utils/api/listing';
	import { getNft } from '$utils/api/nft';
	import { fetchCurrentUserData, fetchProfileData } from '$utils/api/profile';
	import { isAuthTokenExpired } from '$utils/auth/token';
	import { userRoles } from '$utils/auth/userRoles';
	import { closePopup, existsInstanceOfId, setPopup, type PopupHandler } from '$utils/popup';
	import { findEthAddress } from '$utils/validator/isEthAddress';
	import { walletConnected, walletDisconnected } from '$utils/wallet';

	export let errorCode = null;

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
		return [RegExp('create.*'), RegExp('profile/edit'), RegExp('management.*'), RegExp('admin.*'), RegExp('collections/new/edit')];
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
			props: { adapter: userAuthLoginPopupAdapter, onLoginSuccess },
		});
	}

	function setWalletConnectionPopup(onSuccessRedirect?: string) {
		const onConnectSuccess = () => onSuccessRedirect && goto(onSuccessRedirect);

		setPopup(WalletNotConnectedPopup, {
			unique: true,
			props: { onConnectSuccess },
		});
	}

	// Handler for when the user is already in the app and is about
	// to navigate to a protected route
	beforeNavigate(async ({ to, cancel }) => {
		if (!to?.url.pathname) {
			return;
		}

		if (isConnectionRequired(to.url.pathname)) {
			cancel();
			setWalletConnectionPopup(to.url.pathname);
		}

		if ($walletConnected && isProtectedAndExpired(to.url.pathname)) {
			cancel();
			setLoginPopup(to.url.pathname);
		}

		// When the user is trying to access his profile and the the profile has not been created on the backend,
		// request him to sign in, which will create the profile.
		if (to.url.pathname === '/profile' || RegExp(`profile/${$currentUserAddress}`).test(to.url.pathname)) {
			$profileData = await fetchCurrentUserData();
			if (!$profileData) {
				cancel();
				setPopup(AuthLoginPopup, {
					unique: true,
					props: {
						adapter: userAuthLoginPopupAdapter,
						onLoginSuccess: async () => {
							await refreshProfileData();
							goto('/profile');
						},
					},
				});
			}
		}
	});

	// Handler for when the app is first loaded on a auth protected route
	afterNavigate(async ({ from, to }) => {
		// Restrict routes to verified creators
		if (to.url.pathname.match(/create\/*/) || to.url.pathname === '/collections/new/edit' || to.url.pathname.match(/management*/)) {
			if (to.url.pathname.match(/create\/*/) || to.url.pathname === '/collections/new/edit') {
				profileData.subscribe((profile) => {
					if (profile && (profile.roles.includes('inactivated_user') || !profile.roles.includes('verified_user'))) {
						if (!profile.roles.includes('superadmin')) {
							// This check occurs only if the user is not the above.
							// when placed above it causes 403 for other users, so if user does not have all three, they get the 403
							errorCode = 403;
						}
					} else if (profile && (profile.roles.includes('verified_user') || profile.roles.includes('superadmin'))) {
						// reset the error to ensure displayed error is updated on UI
						errorCode = null;
					}
				});
			}

			// Pages only accessible by superadmins
			if (to.url.pathname.match(/management*/)) {
				profileData.subscribe((profile) => {
					if (profile && !(profile.roles.includes('superadmin') || profile.roles.includes('admin'))) {
						errorCode = 403;
					} else if (profile && (profile.roles.includes('superadmin') || profile.roles.includes('admin'))) {
						// reset the error to ensure displayed error is updated on UI
						errorCode = null;
					}
				});
			}
		} else if (to.url.pathname.match(/profile*/)) {
			let accessingProfileData = await fetchProfileData(findEthAddress(to.url.pathname));

			profileData.subscribe((profile) => {
				if (
					accessingProfileData &&
					accessingProfileData.roles?.includes('inactivated_user') &&
					findEthAddress(to.url.pathname).toLowerCase() !== profile.address.toLowerCase() &&
					(!profile || (!profile.roles?.includes('admin') && !profile.roles?.includes('superadmin')))
				) {
					errorCode = 403;
				} else if (profile && (profile.roles?.includes('admin') || profile.roles?.includes('superadmin'))) {
					// reset the error to ensure displayed error is updated on UI
					errorCode = null;
				}
			});
		} else {
			// first set error to null, and then figure things out from there
			// prevents bug related to the ui seeming unresponsive once error has been thrown
			// basically keeps showing 403
			errorCode = null;
		}

		// open unipop if url has nft or listing id param
		if (to.url.searchParams.has('nftId')) {
			const id = to.url.searchParams.get('nftId');

			if (!existsInstanceOfId(id)) {
				const nft = await getNft(id);
				const options = await nftToCardOptions(nft);
				openCardPopupFromOptions(options);
			}
		} else if (to.url.searchParams.has('listingId')) {
			const id = to.url.searchParams.get('listingId');

			if (!existsInstanceOfId(id)) {
				const listing = await getListing(id);
				const options = await listingToCardOptions(listing);

				const invalidStatuses: ListingStatus[] = ['SIGNATURE_EXPIRED', 'SIGNATURE_OR_DATA_INVALID', 'SIGNATURE_USED'];
				const showInvalidListingMessage = invalidStatuses.includes(options.rawListingData.listingStatus);

				openCardPopupFromOptions(options, { showInvalidListingMessage });
			}
		} else if (from?.url.searchParams.has('nftId') && !to.url.searchParams.has('nftId')) {
			closePopup(from?.url.searchParams.get('nftId'));
		} else if (from?.url.searchParams.has('listingId') && !to.url.searchParams.has('listingId')) {
			closePopup(from?.url.searchParams.get('listingId'));
		}
	});

	$: if ($walletDisconnected && isConnectionRequired($page.url.pathname)) {
		setWalletConnectionPopup($page.url.href);
		goto('/');
	}

	$: if ($currentUserAddress && $connectionDetails && isProtectedAndExpired($page.url.pathname)) {
		setLoginPopup($page.url.pathname);
		goto('/');
	}

	userRoles.subscribe((roles) => {
		if (!roles) return;

		// If the user is not an admin and trying to access admin routes, redirect to the home page
		if ($page.url.pathname.startsWith('/admin') && (!roles.includes('admin') || !roles.includes('superadmin'))) {
			errorCode = 403;
		} else if ($page.url.pathname.startsWith('/admin') && (roles.includes('admin') || roles.includes('superadmin'))) {
			// reset the error to ensure displayed error is updated on UI
			errorCode = null;
		}
	});
</script>
