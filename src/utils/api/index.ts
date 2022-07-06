import { currentUserAddress, connectionDetails } from '$stores/wallet';
import { get } from 'svelte/store';

const LATEST = 2;
const DATABASE_ITERATION = 2;

export type ApiVersion = 'latest' | `sprint-${number}` | 'v2';

export function getApiUrl(apiVersion: ApiVersion, apiPath: string): string {
	let domain = null;

	const shouldUseMain = get(connectionDetails)?.chainId === 1 || !get(currentUserAddress);

	if (shouldUseMain) {
		domain = 'https://api.hinata.io/api/v1';
	} else {
		let overrideApiUrl = import.meta.env.VITE_OVERRIDE_API_URL as string;

		if (overrideApiUrl) {
			overrideApiUrl = overrideApiUrl.replace(/\/+$/, '');

			console.warn(`[API] Ignoring '${apiVersion}' version and overriding the API URL with: "${overrideApiUrl}"`);
			domain = overrideApiUrl;
		} else if (apiVersion === 'v2') {
			domain = 'https://hinata-test-v2.rekt-news.xyz/api/v2';
		} else if (apiVersion === 'latest') {
			domain = `https://hinata-test-v${LATEST}.rekt-news.xyz/api/v${DATABASE_ITERATION}`;
		} else if (apiVersion.match(/^sprint-\d+$/)) {
			const versionNumber = apiVersion.match(/^sprint-(\d+)$/)[1];
			domain = `https://hinata-test-v${versionNumber}.rekt-news.xyz/api/v${DATABASE_ITERATION}`;
		}
	}

	console.log(shouldUseMain, domain);

	return `${domain}/${apiPath}`;
}
