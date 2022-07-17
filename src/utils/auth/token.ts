import { getApiUrl } from '$utils/api';
import { isJwtExpired } from '$utils/jwt';
import { getAddress } from '$utils/misc/getters';
import { setPopup } from '$utils/popup';
import { userAuthLoginPopupAdapter } from '$lib/components/auth/AuthLoginPopup/adapters/userAuthLoginPopupAdapter';
	import AuthLoginPopup from '$lib/components/auth/AuthLoginPopup/AuthLoginPopup.svelte';
import { refreshProfileData } from '$stores/user';

function getAuthTokenKey(address: string) {
	if (!address) {
		address = getAddress();
	}

	if (!address) {
		throw new Error('No address provided and could not automatically get an address.');
	}

	return `authToken-${address}-${getApiUrl('latest', '')}`;
}

export async function getAuthToken(address?: string) {
	if (!address) {
		address = getAddress();
	}

	if (!address) {
		throw new Error('No address provided and could not automatically get an address.');
	}

	const token = localStorage.getItem(getAuthTokenKey(address));

	if(token ? isJwtExpired(token) : true) {
		const handler = setPopup(AuthLoginPopup, {
			unique: true,
			returnPromise: true,
			props: {
				adapter: userAuthLoginPopupAdapter,
				onLoginSuccess: async () => {
					await refreshProfileData();
				}
			}
		});

		await handler?.closePromise.promise;
		if(!handler?.closePromise.fulfilled) return null;
		
		return localStorage.getItem(getAuthTokenKey(address));
	}

	return localStorage.getItem(getAuthTokenKey(address));
}

export function setAuthToken(address: string, token: string) {
	const key = getAuthTokenKey(address);
	localStorage.setItem(key, token);
}

export async function isAuthTokenExpired(address: string) {
	const token = await getAuthToken(address);

	if (!token) return true;

	return isJwtExpired(token);
}

export function removeAuthToken(address: string) {
	const key = getAuthTokenKey(address);
	localStorage.removeItem(key);
}
