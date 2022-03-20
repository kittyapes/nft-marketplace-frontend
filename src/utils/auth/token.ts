import { isJwtExpired } from '$utils/jwt';
import { getAddress } from '$utils/misc/getters';

function getAuthTokenKey(address: string) {
	if (!address) {
		address = getAddress();
	}

	if (!address) {
		throw new Error('No address provided and could not automatically get an address.');
	}

	return `authToken-${address}`;
}

export function getAuthToken(address?: string) {
	return localStorage.getItem(getAuthTokenKey(address));
}

export function setAuthToken(address: string, token: string) {
	const key = getAuthTokenKey(address);
	localStorage.setItem(key, token);
}

export function isAuthTokenExpired(address: string) {
	const token = getAuthToken(address);

	if (!token) return true;

	return isJwtExpired(token);
}

export function removeAuthToken(address: string) {
	const key = getAuthTokenKey(address);
	localStorage.removeItem(key);
}
