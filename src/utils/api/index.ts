import { currentUserAddress } from '$stores/wallet';
import { isJwtExpired } from '$utils/jwt';
import { get } from 'svelte/store';

function getTokenKey(address: string) {
	return `authToken-${address}`;
}

export function setAuthToken(address: string, token: string) {
	const key = getTokenKey(address);
	localStorage.setItem(key, token);
}

export function getAuthToken(address: string) {
	return localStorage.getItem(getTokenKey(address));
}

export function isAuthExpired(address: string) {
	const token = getAuthToken(address);

	if (!token) return true;

	return isJwtExpired(token);
}

export function getAxiosConfig(address?: string) {
	if (!address) {
		address = get(currentUserAddress);
	}

	console.log(address);

	if (!address) {
		throw new Error('No address provided and could not automatically get an address.');
	}

	const token = getAuthToken(address);

	if (!token) return {};

	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}
