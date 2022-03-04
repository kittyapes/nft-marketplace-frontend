import { api } from '$constants/api';
import axios from 'axios';
import { getAxiosConfig } from '$utils/api';

export interface AdminData {
	_id: string;
	name: string;
	wallet: string;
	roles: string;
	timeCreated: string;
	updatedAt: string;
}

export async function getAdmins() {
	const res = await axios.get(api + '/v1/admins', getAxiosConfig());

	if (res.status !== 200) {
		return res;
	}

	return res.data.data.docs as AdminData[];
}

export async function postCreateAdmin(name: string, address: string, roles: string) {
	return await axios.post(api + '/v1/admins', { wallet: address, roles, name }, getAxiosConfig());
}

export async function putModifyAdmin(_id: string, name: string, address: string, roles: string) {
	return await axios.put(
		api + '/v1/admins/' + _id,
		{ wallet: address, roles, name },
		getAxiosConfig()
	);
}

export async function deleteAdmin(_id: string) {
	return await axios.delete(api + '/v1/admins/' + _id, getAxiosConfig());
}
