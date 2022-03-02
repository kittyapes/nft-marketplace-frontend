import { api } from '$constants/api';
import axios from 'axios';
import { getAxiosConfig } from '$utils/api';

export async function postCreateAdmin(name: string, address: string, roles: string) {
	return await axios.post(api + '/v1/admins', { wallet: address, roles, name }, getAxiosConfig());
}
