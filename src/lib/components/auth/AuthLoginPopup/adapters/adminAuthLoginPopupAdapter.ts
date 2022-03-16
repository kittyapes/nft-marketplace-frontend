import type { AuthLoginPopupAdapter } from '../authLoginPopupAdapter';
import axios from 'axios';
import { api } from '$constants/api';
import { setAdminAuthToken } from '$utils/api';

function getPrompt() {
	return {
		title: 'You need to be signed in to <br/> perform this action.'
	};
}

async function getMessageToSign(address: string) {
	const res = await axios.post(api + '/v1/request-login', { address });
	const message = res.data?.data?.message;

	if (!message) {
		return null;
	}

	return message;
}

async function getAuthToken(address: string, signature: string) {
	const res = await axios.post(api + '/v1/login', { wallet: address, signature });

	return res.data?.data?.token?.token;
}

export const adminAuthLoginPopupAdapter: AuthLoginPopupAdapter = {
	getPrompt,
	getMessageToSign,
	getAuthToken,
	useToken: setAdminAuthToken
};
