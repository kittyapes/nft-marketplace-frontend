import { getEnv } from '$utils/env';

const LATEST = 27;

export type ApiVersion = 'latest' | `sprint-${number}`;

export function getApiUrl(apiVersion: ApiVersion, apiPath: string): string {
	let domain = null;

	if (getEnv() === 'dev') {
		console.warn(`[API] Ignoring '${apiVersion}' version and using dev environment`);
		domain = 'https://hinata-dev.rekt-news.xyz/api/v1';
	} else if (apiVersion === 'latest') {
		domain = `https://hinata-test-v${LATEST}.rekt-news.xyz/api/v1`;
	} else if (apiVersion.match(/^sprint-\d+$/)) {
		const versionNumber = apiVersion.match(/^sprint-(\d+)$/)[1];
		domain = `https://hinata-test-v${versionNumber}.rekt-news.xyz/api/v1`;
	}

	return `${domain}/${apiPath}`;
}