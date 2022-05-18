import { getEnv } from '$utils/env';

const LATEST = 2;
const DATABASE_ITERATION = 2;

export type ApiVersion = 'latest' | `sprint-${number}`;

export function getApiUrl(apiVersion: ApiVersion, apiPath: string): string {
	let domain = null;

	let overrideApiUrl = import.meta.env.VITE_OVERRIDE_API_URL as string;

	if (overrideApiUrl) {
		overrideApiUrl = overrideApiUrl.replace(/\/+$/, '');

		console.warn(`[API] Ignoring '${apiVersion}' version and overriding the API URL with: "${overrideApiUrl}"`);
		domain = overrideApiUrl;
	} else if (apiVersion === 'latest') {
		domain = `https://hinata-test-v${LATEST}.rekt-news.xyz/api/v${DATABASE_ITERATION}`;
	} else if (apiVersion.match(/^sprint-\d+$/)) {
		const versionNumber = apiVersion.match(/^sprint-(\d+)$/)[1];
		domain = `https://hinata-test-v${versionNumber}.rekt-news.xyz/api/v${DATABASE_ITERATION}`;
	}

	return `${domain}/${apiPath}`;
}
