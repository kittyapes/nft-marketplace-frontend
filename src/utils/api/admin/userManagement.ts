import { api } from '$constants/api';
import axios from 'axios';
import { getAxiosConfig } from '..';

export async function addToVerificationQueue(address: string) {
	return await axios
		.post(api + '/v1/accounts/' + address + '/promote', {}, getAxiosConfig())
		.then((res) => res.data);
}
