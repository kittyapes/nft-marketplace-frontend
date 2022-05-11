import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import type { UserData, UserRole } from 'src/interfaces/userData';
import { getApiUrl } from '..';

export const promoteUser = async (address: string, role: UserRole) => {
    try {
        /*
        const res = await axios.get(getApiUrl('latest', 'users'), { params: { sortBy, sortReversed }, ...getAxiosConfig()});
        return res.data.data as UserData[];*/
    } catch {
        notifyError('Failed to fetch users');
        throw new Error('Failed to fetch users');
    } 
}