import type { AuthLoginPopupAdapter } from '../authLoginPopupAdapter';
import sha256 from 'hash.js/lib/hash/sha/256.js';
import axios from 'axios';
import { setAuthToken } from '$utils/auth/token';
import { getApiUrl } from '$utils/api';

let timestamp = null;

function getData(address: string): any {
	const data = {
		address,
		device_info: 'desktop',
		upload_time: timestamp,
		checksum: null,
		signature: null,
	};

	data.checksum = sha256()
		.update(data.device_info + data.upload_time + data.address)
		.digest('hex')
		.substr(32);

	return data;
}

function getPrompt() {
	return {
		title: 'You need to be signed in to <br/> perform this action.',
	};
}

async function getMessageToSign(address: string) {
	if (!address) {
		return null;
	}

	timestamp = Date.now();

	return getData(address).checksum;
}

async function getAuthToken(address: string, signature: string) {
	if (!address) {
		return null;
	}

	const data = getData(address);

	data.signature = signature;
	const responseData = await axios.post(getApiUrl('latest', 'users/login'), data).catch(() => null);
	const token = responseData?.data.data.token.token;

	console.debug('Info: Retrieved new auth token:\n' + token);

	return token;
}

export const userAuthLoginPopupAdapter: AuthLoginPopupAdapter = {
	getPrompt,
	getMessageToSign,
	getAuthToken,
	useToken: setAuthToken,
};
