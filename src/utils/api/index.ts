import { connectionDetails, currentUserAddress } from '$stores/wallet';
import { get } from 'svelte/store';
import type { AxiosError, AxiosResponse } from 'axios';

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

export interface ApiCallResult<T> {
	err?: AxiosError;
	res?: AxiosResponse;
	data?: T;
}
