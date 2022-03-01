import { api } from '$constants/api';
import axios from 'axios';
import { getAxiosConfig } from '$utils/api';

export async function postCreateAdmin(address: string, permissions: string[]) {
	return await axios.post(
		api + '/v1/makeAdmin',
		{ address, permissions, userType: 'admin' },
		getAxiosConfig()
	);
}
