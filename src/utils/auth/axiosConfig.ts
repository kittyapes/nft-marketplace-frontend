import { getAuthToken } from './token';

export async function getAxiosConfig(address?: string) {
	const token = await getAuthToken(address);

	if (!token) return {};

	return {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
}
