import { getAxiosConfig } from '$utils/auth/axiosConfig';
import { notifyError } from '$utils/toast';
import axios from 'axios';
import type { UserData } from 'src/interfaces/userData';
import { getApiUrl } from '..';

export const getUsers = async () => {
    let sortBy = 'ALPHABETIC'
    try {
        
        const res = await axios.get(getApiUrl('latest', 'accounts'), { params: { sortBy }, ...getAxiosConfig()});
        return res.data.data as UserData[];
    } catch {
        notifyError('Failed to fetch users');
        throw new Error('Failed to fetch users');
    } 
}