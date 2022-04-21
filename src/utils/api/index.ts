export type ApiVersion = 'latest' | 'sprint-26';

const versionToUrl: Partial<Record<ApiVersion, string>> = {
	'sprint-26': 'https://hinata-test-v26.rekt-news.xyz/api/v26'
};

export function getApiUrl(apiVersion: ApiVersion, apiPath: string): string {
	if (apiVersion === 'latest') {
		apiVersion = Object.keys(versionToUrl).slice(-1)[0] as ApiVersion;
	}

	return `${versionToUrl[apiVersion]}/${apiPath}`;
}
