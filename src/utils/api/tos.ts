import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { api, getApiUrl, type ApiCallResult } from '.';

export interface TosVersionObject {
	status: 'DRAFT' | 'PUBLISHED';
	_id: string;
	version: string;
	pdf_link: string;
	html_link: string;
	version_hash: string;
	createdAt: string;
	updatedAt: string;
}

export interface TosAgreeObject {
	hasAgreed: boolean;
	version_hash: string;
	version: string;
}

export interface LatestVersionRes {
	error: false;
	data: TosVersionObject;
}

export async function apiGetLatestTosVersion(): Promise<ApiCallResult<LatestVersionRes>> {
	return await api.get(getApiUrl(null, '/tos/latest-version'));
}

export interface AgreeToTosResponse {
	error: false;
	data: {
		version: string;
	};
}

export async function apiAgreeToTos(versionLabel: string, signature: string): Promise<ApiCallResult<AgreeToTosResponse>> {
	return await api.post(getApiUrl(null, '/tos/agree'), { version: versionLabel, signature }, await getAxiosConfig());
}

export interface IsAgreedResponse {
	error: boolean;
	data: TosAgreeObject;
}

export async function apiIsAgreedToLatestTos(): Promise<ApiCallResult<IsAgreedResponse>> {
	return await api.get(getApiUrl(null, '/tos/is-agreed-to-latest'), await getAxiosConfig());
}

// Create ToS version
export interface CreateTosVersionResponse {
	error: boolean;
	data: TosVersionObject;
}

export async function apiPostNewTosVersion(label: string, pdfUrl: string, htmlUrl: string): Promise<ApiCallResult<CreateTosVersionResponse>> {
	return await api.post(
		getApiUrl(null, '/tos'),
		{
			version: label,
			pdf_link: pdfUrl,
			html_link: htmlUrl,
		},
		await getAxiosConfig(),
	);
}

// Get a list of ToS versions
interface AdminGetTosVersionsRes {
	error: boolean;
	data: TosVersionObject[];
}

export async function apiAdminGetTosVersions(): Promise<ApiCallResult<AdminGetTosVersionsRes>> {
	return await api.get(getApiUrl(null, '/tos/versions'), await getAxiosConfig());
}

// Discard a ToS draft
interface DiscardTosDraftRes {
	error: boolean;
}

export async function apiDiscardTosDraft(id: string): Promise<ApiCallResult<DiscardTosDraftRes>> {
	return await api.delete(getApiUrl(null, '/tos/' + id), await getAxiosConfig());
}

// Publish a ToS draft
interface PublishTosDraftRes {
	error: boolean;
}

export async function apiPublishTosDraft(label: string): Promise<ApiCallResult<PublishTosDraftRes>> {
	return await api.post(getApiUrl(null, '/tos/publish'), { version: label }, await getAxiosConfig());
}
