import { isJwtExpired } from '$utils/jwt';
import { getAddress } from '$utils/misc/getters';

// Admin auth
function getAdminTokenKey(address: string) {
	if (!address) {
		address = getAddress();
	}

	if (!address) {
		throw new Error('No address provided and could not automatically get an address.');
	}

	return `authToken-${address}`;
}

export function getAdminAuthToken(address?: string) {
	return localStorage.getItem(getAdminTokenKey(address));
}

export function setAdminAuthToken(address: string, token: string) {
	const key = getAdminTokenKey(address);
	localStorage.setItem(key, token);
}

export function isAdminAuthExpired(address: string) {
	const token = getAdminAuthToken(address);

	if (!token) return true;

	return isJwtExpired(token);
}

export function getAdminAxiosConfig(address?: string) {
	const token = getAdminAuthToken(address);

	if (!token) return {};

	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}

// User auth
function getUserTokenKey(address: string) {
	if (!address) {
		address = getAddress();
	}

	if (!address) {
		throw new Error('No address provided and could not automatically get an address.');
	}

	return `authToken-user-${address}`;
}

export function setUserAuthToken(address: string, token: string) {
	const key = getUserTokenKey(address);
	localStorage.setItem(key, token);
}

export function getUserAuthToken(address: string) {
	return localStorage.getItem(getUserTokenKey(address));
}

export function isUserAuthExpired(address: string) {
	const token = getUserAuthToken(address);

	if (!token) return true;

	return isJwtExpired(token);
}

// Used for drop creation, etc
export function getUserAxiosConfig(address?: string) {
	const token = getUserAuthToken(address);

	if (!token) return {};

	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}
