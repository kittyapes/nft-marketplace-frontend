import { getEnv } from '$utils/env';

export type ApiVersion = 'latest' | 'sprint-26';

const versionToUrl: Partial<Record<ApiVersion, string>> = {
	'sprint-26': 'https://hinata-test-v26.rekt-news.xyz/api/v26'
};

export function getApiUrl(apiVersion: ApiVersion, apiPath: string): string {
	let domain = null;

	if (getEnv() === 'dev') {
		console.info('[API] Using dev environment');
		domain = 'https://hinata-dev.rekt-news.xyz/api/v1';
	} else if (apiVersion === 'latest') {
		apiVersion = Object.keys(versionToUrl).slice(-1)[0] as ApiVersion;
		domain = versionToUrl[apiVersion];
	}

	return `${domain}/${apiPath}`;
}
