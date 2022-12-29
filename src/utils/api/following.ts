import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { notifyError, notifySuccess } from '$utils/toast';
import axios from 'axios';
import { getApiUrl } from '.';

/**
 * Fetch profile data from the from the public user data API endpoint.
 * @param target The address of the profile.
 * @returns Profile data or `null` in case of an error.
 */
export async function fetchIsFollowing(target: string, currentUser: string) {
	if (!target) return null;

	let res;
	const config = await getAxiosConfig(currentUser);

	try {
		res = await axios.get(getApiUrl('latest', `/users/isFollowing?target=${target}`), config);
	} catch (err) {
		console.error('Failed To Check if you follow this User.');
		console.error(err);

		notifyError('Failed To Check if you follow this User.');

		return false;
	}

	if (!res) {
		return null;
	}

	return res.data.data.isFollowing;
}

/**
 * Follow/unfollow user
 * @param address The address of the profile.
 * @param follow Boolean to set the follow attribute to
 *
 * @returns Boolean or `null` in case of an error.
 */
export async function followUnfollowUser(target: string, follow: boolean) {
	if (!target) return null;

	let res;
	const config = await getAxiosConfig();

	try {
		res = await axios.post(
			getApiUrl('latest', `/users/follow`),
			{
				target,
				follow,
			},
			config,
		);
	} catch (err) {
		console.error(`Failed to ${follow ? 'follow' : 'unfollow'} user.`);
		console.error(err);

		notifyError(`Failed to ${follow ? 'follow' : 'unfollow'} user.`);

		return false;
	}

	if (!res) {
		return null;
	}

	notifySuccess(`Successfully ${follow ? 'followed' : 'unfollowed'}`);

	return res.data.data.isFollowing;
}
