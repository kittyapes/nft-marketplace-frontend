import { connectionDetails, currentUserAddress } from '$stores/wallet';
import { get } from 'svelte/store';
import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';

export type ApiVersion = 'latest' | `sprint-${number}` | 'v2';

export function getApiUrl(apiVersion: ApiVersion, apiPath: string): string {
	let apiUrl: string = null;

	const overrideUrl = import.meta.env.VITE_OVERRIDE_API_URL;

	if (overrideUrl) {
		apiUrl = overrideUrl;
	} else {
		let useNetworkId = import.meta.env.VITE_DEFAULT_NETWORK;

		const conDetails = get(connectionDetails);

		if (get(currentUserAddress) && conDetails) {
			useNetworkId = conDetails.chainId;
		}

		apiUrl = import.meta.env[`VITE_${useNetworkId}_API_URL`] as string;

		if (!apiUrl) {
			throw new Error(`VITE_${useNetworkId}_API_URL env variable not set!`);
		}
	}

	if (apiUrl.endsWith('/')) {
		apiUrl = apiUrl.replace(/\/$/, '');
	}

	if (!apiPath.startsWith('/')) {
		apiPath = '/' + apiPath;
	}

	return apiUrl + apiPath;
}

interface ApiErrorResponseData {
	statusCode: number;
	error: string;
	message: string;
}

export interface ApiCallResult<T> {
	data?: T;
	errData?: ApiErrorResponseData;
	err?: AxiosError;
}

function responseHandler<T>(response: AxiosResponse<any>) {
	if (response.status === 200) {
		const data = response?.data;

		return <ApiCallResult<T>>{ data };
	}

	return response;
}

function responseErrorHandler<T>(err: AxiosError) {
	return <ApiCallResult<T>>{ errData: err.response.data, err };
}

const axiosDefaults = {};
export const api = axios.create(axiosDefaults);

api.interceptors.response.use(responseHandler, responseErrorHandler);
