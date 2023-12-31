import { getAuthTokenAsync } from './token';

export async function getAxiosConfig(address?: string) {
	const token = await getAuthTokenAsync(address);

	if (!token) return {};

	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}
