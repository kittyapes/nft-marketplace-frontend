import { api } from '$constants/api';
import axios from 'axios';

export async function requestLogin(address: string) {
	const res = await axios.post(api + '/v1/request-login', { address });

	return res.data.data.message;
}

export async function login(address: string, signature: string) {
	const res = await axios.post(api + '/v1/login', { wallet: address, signature });

	console.log(res);

	return res.data.data.token.token as string;
}
