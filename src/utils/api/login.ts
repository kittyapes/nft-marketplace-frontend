import { browser } from '$app/env';
import { api } from '$constants/api';
import { isJwtExpired } from '$utils/jwt';
import axios from 'axios';
import { writable } from 'svelte/store';
import { getAuthToken, setAuthToken } from '.';
import sha256 from 'hash.js/lib/hash/sha/256.js';

// TODO: init this wil null when the API is updated to return user's role
export const isAdmin = writable<boolean>(
	browser && getAuthToken() !== null && !isJwtExpired(getAuthToken())
);

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

	// TODO: Remove this when the API is updated to return the user's role.
	isAdmin.set(true);
}

export async function loginServerNotify(address: string) {
	const data = {
		address,
		device_info: 'desktop',
		upload_time: Date.now(),
		checksum: null
	};

	data.checksum = sha256()
		.update(data.device_info + data.upload_time + data.address)
		.digest('hex')
		.substr(32);

	await axios.post(api + '/v1/accounts/login', data);
}
