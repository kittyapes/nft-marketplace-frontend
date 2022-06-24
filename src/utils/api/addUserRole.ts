	import { api } from '$constants/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import type { UserRole } from 'src/interfaces/userData';
import { getApiUrl } from '.';

export async function addUserRole(address: string, roles: UserRole[]) {
	const res = await axios
		.put(
			getApiUrl('latest', 'admins/' + address),
			{
				roles,
			},
			getAxiosConfig()
		)
		.catch(() => null);

	if (res?.status !== 200) {
		throw new Error(res?.data.message);
	}

	return res.data.data;
}
