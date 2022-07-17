import { connectionDetails, currentUserAddress } from '$stores/wallet';
import { get } from 'svelte/store';
import type { AxiosError, AxiosResponse } from 'axios';

export type ApiVersion = 'latest' | `sprint-${number}` | 'v2';

export function getApiUrl(apiVersion: ApiVersion, apiPath: string): string {
	// defaults to override
	const chainId = get(currentUserAddress) ? get(connectionDetails)?.chainId ?? 'OVERRIDE' : +import.meta.env.VITE_DEFAULT_NETWORK || 'OVERRIDE';

	let apiUrl = import.meta.env[`VITE_${chainId}_API_URL`] as string;

	if (!apiUrl) {
		throw new Error(`VITE_${chainId}_API_URL env variable not set!`);
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
