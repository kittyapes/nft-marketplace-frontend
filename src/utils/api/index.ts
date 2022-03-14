import { currentUserAddress } from '$stores/wallet';
import { isJwtExpired } from '$utils/jwt';
import { get } from 'svelte/store';

function getAdminTokenKey(address: string) {
	return `authToken-${address}`;
}

function getUserTokenKey(address: string) {
	return `authToken-user-${address}`;
}

export function setAdminAuthToken(address: string, token: string) {
	const key = getAdminTokenKey(address);
	localStorage.setItem(key, token);
}

export function getAdminAuthToken(address: string) {
	return localStorage.getItem(getAdminTokenKey(address));
}

export function setUserAuthToken(address: string, token: string) {
	const key = getUserTokenKey(address);
	localStorage.setItem(key, token);
}

export function getUserAuthToken(address: string) {
	return localStorage.getItem(getUserTokenKey(address));
}

export function isAdminAuthExpired(address: string) {
	const token = getAdminAuthToken(address);

	if (!token) return true;

	return isJwtExpired(token);
}

export function isUserAuthExpired(address: string) {
	const token = getUserAuthToken(address);

	if (!token) return true;

	return isJwtExpired(token);
}

export function getAdminAxiosConfig(address?: string) {
	if (!address) {
		address = get(currentUserAddress);
	}

	if (!address) {
		throw new Error('No address provided and could not automatically get an address.');
	}

	const token = getAdminAuthToken(address);

	if (!token) return {};

	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}

// Used for drop creation, etc
export function getUserAxiosConfig(address?: string) {
	if (!address) {
		address = get(currentUserAddress);
	}

	if (!address) {
		throw new Error('No address provided and could not automatically get an address.');
	}

	const token = getUserAuthToken(address);

	if (!token) return {};

	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}
