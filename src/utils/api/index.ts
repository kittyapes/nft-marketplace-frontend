import { isJwtExpired } from '$utils/jwt';

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

export function getAxiosConfig(address: string) {
	const token = getAuthToken(address);

	if (!token) return {};

	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}
