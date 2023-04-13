import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { notifyError, notifySuccess } from '$utils/toast';
import axios from 'axios';
import { getApiUrl } from '.';
import qs from 'qs';

/**
 * Fetch profile data from the from the public user data API endpoint.
 * @param targets An array of addresses to check if user follows them.
 * @returns Profile data or `null` in case of an error.
 */
export async function fetchIsFollowing(targets: string[]): Promise<{ [address: string]: boolean }> {
	if (!targets) return {};

	let res;

	try {
		res = await axios.get(getApiUrl('latest', `/users/isFollowing`), {
			params: { targets: targets },
			paramsSerializer: (params) => {
				return qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true });
			},
			...(await getAxiosConfig()),
		});
	} catch (err) {
		console.error('Failed To Check if you follow this User.');
		console.error(err);

		return {};
	}

	if (!res) {
		return {};
	}

	return res.data.data;
}

/**
 * Follow/unfollow user
 * @param target The address of the profile.
 * @param isFollowing Boolean to improve error/success notifications and logs
 *
 * @returns {address: string; followingCount: number; followersCount: number; } or `null` in case of an error.
 */
export async function followUnfollowUser(
	target: string,
	isFollowing: boolean,
): Promise<{
	address: string;
	followingCount: number;
	followersCount: number;
} | null> {
	if (!target) return null;

	let res;
	const config = await getAxiosConfig();

	try {
		res = await axios.post(
			getApiUrl('latest', `/users/followOrUnFollow`),
			{
				target,
			},
			config,
		);
	} catch (err) {
		console.error(`Failed to ${!isFollowing ? 'follow' : 'unfollow'} user.`);
		console.error(err);

		notifyError(`Failed to ${!isFollowing ? 'follow' : 'unfollow'} user.`);

		return null;
	}

	if (!res) {
		return null;
	}

	notifySuccess(`Successfully ${!isFollowing ? 'followed' : 'unfollowed'}`);

	return res.data.data;
}
