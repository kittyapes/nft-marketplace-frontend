import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import type { UserData } from 'src/interfaces/userData';
import { getApiUrl } from '..';

export async function getAdmins() {
	const res = await axios.get(getApiUrl('latest', 'admins/users'), {params: {role: 'admin', limit: 100},  ...await getAxiosConfig()});
	if (res.status !== 200) {
		return res;
	}

	return res.data.data as UserData[];
}
