import jwtDecode from 'jwt-decode';
import type { TosAgreeObject } from './api/tos';

/**
 * Check if JWT is expired or invalid.
 * @param token JWT string.
 * @returns True if the token is expired or invalid.
 */
export function isJwtExpired(token: string) {
	if (typeof token !== 'string' || !token) throw new Error('Invalid token provided');

	let isJwtExpired = false;

	try {
		const { exp } = jwtDecode(token) as { exp: number };
		const currentTime = new Date().getTime() / 1000;
		isJwtExpired = currentTime > exp;
	} catch (e) {
		console.error('Error when decoding JWT:', e.message);
		isJwtExpired = true;
	}

	return isJwtExpired;
}

export function decodeJwt(token: string) {
	if (!isJwtExpired(token)) {
		const decodedToken = jwtDecode(token) as {
			tos: TosAgreeObject | null;
			agent: string;
			iat: number;
			_id: string;
			exp: number;
		};
		return decodedToken;
	}

	return null;
}
