import type { EthAddress } from '$interfaces';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { api, getApiUrl, type ApiCallResult } from '.';

export type UserExpResponse = {
	exp: number;
	userAddress: EthAddress;
};

export async function getUserExpPoints(): Promise<ApiCallResult<UserExpResponse>> {
	const res = await api.get(getApiUrl(null, '/exp'), await getAxiosConfig());
	return res.data;
}

export type FetchExpLeaderboardOptions = {
	page: number;
	limit: number;
};

export type ExpLeaderboardUserRecord = {
	_id: string;
	address: EthAddress;
	thumbnailUrl: string;
	coverUrl: string;
	username: string;
	exp: number;
	rank: number;
};

export async function getExpLeaderboard(
	params: FetchExpLeaderboardOptions,
): Promise<ApiCallResult<ExpLeaderboardUserRecord[]>> {
	const res = await api.get(getApiUrl(null, '/exp/leaderboard'), { params });
	return res.data;
}
