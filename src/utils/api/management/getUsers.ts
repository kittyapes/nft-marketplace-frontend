import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import type { UserData } from 'src/interfaces/userData';
import { getApiUrl } from '..';

export interface FetchUsersOptions {
	sortBy?: string;
	query?: string;
	sortReversed?: boolean;
	role?: string;
	createdBefore?: number;
	status?: string;
}

export const getUsers = async (options?: FetchUsersOptions) => {
	if (options && !options.query) options.query = undefined;
	try {
		const res = await axios.get(getApiUrl('latest', 'admins/users'), { params: options, ...(await getAxiosConfig()) });
		return res.data.data as { users: UserData[]; totalCount: number };
	} catch (err) {
		console.error(err);

		notifyError('Failed to fetch users');
		throw new Error('Failed to fetch users');
	}
};
