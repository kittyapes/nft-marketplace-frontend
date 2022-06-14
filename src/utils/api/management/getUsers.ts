import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import type { UserData } from 'src/interfaces/userData';
import { getApiUrl } from '..';

export interface FetchUsersOptions  {
    sortBy?: string,
    query?: string,
    sortReversed?: boolean,
    role?: string,
    createdBefore?: number,
    status?: string,
}

export const getUsers = async (options?: FetchUsersOptions) => {
    if (options && !options.query) options.query = undefined;
    try {
        console.log(options);
        const res = await axios.get(getApiUrl('latest', 'admins/users'), { params: options , ...getAxiosConfig()});
        return res.data.data as UserData[];
    } catch {
        notifyError('Failed to fetch users');
        throw new Error('Failed to fetch users');
    } 
}