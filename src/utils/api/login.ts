import { api } from '$constants/api';
import axios from 'axios';
import { setAuthToken } from '.';

/**
 * Retrieve a message from the API that can be signed by the wallet provider
 * and used to log in.
 * @param address Current wallet address.
 * @returns A string to sign by the wallet provider.
 */
export async function requestLogin(address: string) {
	const res = await axios.post(api + '/v1/request-login', { address });

	return res.data.data.message;
}

/**
 * Login using the API and set the auth token in local storage.
 * @param address Current wallet address.
 * @param signature The signature provided by the wallet provider.
 */
export async function login(address: string, signature: string) {
	const res = await axios.post(api + '/v1/login', { wallet: address, signature });

	const data = res.data.data as {
		token: { token: string };
	};

	setAuthToken(data.token.token);
}
