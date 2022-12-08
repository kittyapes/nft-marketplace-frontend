import { getApiUrl } from '$utils/api';
import { isJwtExpired } from '$utils/jwt';
import { getAddress } from '$utils/misc/getters';
import { setPopup } from '$utils/popup';
import { userAuthLoginPopupAdapter } from '$lib/components/auth/AuthLoginPopup/adapters/userAuthLoginPopupAdapter';
import AuthLoginPopup from '$lib/components/auth/AuthLoginPopup/AuthLoginPopup.svelte';
import { refreshProfileData } from '$stores/user';

type AuthData = {
	token: string;
	roles: string[];
};

function getAuthTokenKey(address: string) {
	if (!address) {
		address = getAddress();
	}

	if (!address) {
		throw new Error('No address provided and could not automatically get an address.');
	}

	return `userData-${address}-${getApiUrl('latest', '')}`;
}

export function getAuthToken(address?: string) {
	const authData: AuthData = JSON.parse(localStorage.getItem(getAuthTokenKey(address)));
	return authData?.token;
}

/**
 * Attempts to retrieve the auth token for an address from the local storage. If the token is not found
 * or is expired, a popup with the message sign process will be displayed. If the user completes the flow
 * successfully, the obtained token will be returned.
 *
 * @param address Address for which the auth token needs to be obtained.
 * @returns The auth token as a string.
 */
export async function getAuthTokenAsync(address?: string) {
	const token = getAuthToken(address);

	if (token && !isJwtExpired(token)) return token;

	const handler = setPopup(AuthLoginPopup, {
		unique: true,
		returnPromise: true,
		props: {
			adapter: userAuthLoginPopupAdapter,
			onLoginSuccess: async () => {
				await refreshProfileData();
			},
		},
	});

	await handler?.closePromise.promise;
	if (!handler?.closePromise.fulfilled) return null;

	const authData: AuthData = JSON.parse(localStorage.getItem(getAuthTokenKey(address)));
	return authData?.token;
}

export function setAuthToken(address: string, token: string) {
	const key = getAuthTokenKey(address);

	const currentAuthData: AuthData = JSON.parse(localStorage.getItem(getAuthTokenKey(address)));

	const authData: AuthData = {
		token,
		roles: currentAuthData?.roles ? currentAuthData.roles : [],
	};

	localStorage.setItem(key, JSON.stringify(authData));
}

export function isAuthTokenExpired(address: string) {
	const token = getAuthToken(address);

	if (!token) return true;

	return isJwtExpired(token);
}

export function removeAuthData(address: string) {
	const key = getAuthTokenKey(address);
	localStorage.removeItem(key);
}
