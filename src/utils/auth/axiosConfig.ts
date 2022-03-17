import { getAuthToken } from './token';

export function getAxiosConfig(address?: string) {
	const token = getAuthToken(address);

	if (!token) return {};

	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}
