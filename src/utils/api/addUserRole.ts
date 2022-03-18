import { api } from '$constants/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import type { UserRole } from 'src/interfaces/userData';

export async function addUserRole(address: string, role: UserRole) {
	const res = await axios
		.put(
			api + '/v1/admins/' + address,
			{
				roles: role
			},
			getAxiosConfig()
		)
		.catch(() => null);

	return res?.status === 200;
}
