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

	return res?.status === 200;
}
