import { isJwtExpired } from '$utils/jwt';

const tokenKey = 'authToken';

export function setAuthToken(token: string) {
	localStorage.setItem(tokenKey, token);
}

export function getAuthToken() {
	return localStorage.getItem(tokenKey);
}

export function isAuthExpired() {
	const token = getAuthToken();

	if (!token) return true;

	return isJwtExpired(token);
}
