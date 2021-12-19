const tokenKey = 'authToken';

export function setAuthToken(token: string) {
	localStorage.setItem(tokenKey, token);
}

export function getAuthToken() {
	return localStorage.getItem(tokenKey);
}
