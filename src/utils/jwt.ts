import jwtDecode from 'jwt-decode';

/**
 * Check if JWT is expired.
 * @param token JWT string.
 * @returns True if the token is expired.
 */
export function isJwtExpired(token: string) {
	if (typeof token !== 'string' || !token) throw new Error('Invalid token provided');

	let isJwtExpired = false;
	const { exp } = jwtDecode(token) as { exp: number };
	const currentTime = new Date().getTime() / 1000;

	if (currentTime > exp) isJwtExpired = true;

	return isJwtExpired;
}
