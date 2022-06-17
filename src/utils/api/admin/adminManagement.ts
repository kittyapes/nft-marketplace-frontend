import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import type { UserData } from 'src/interfaces/userData';

export async function getAdmins() {
	const res = await axios.get(api + '/v1/admins', getAxiosConfig());

	if (res.status !== 200) {
		return res;
	}

	return res.data.data.docs as UserData[];
}
