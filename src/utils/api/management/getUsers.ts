import { api } from '$constants/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import type { UserData } from 'src/interfaces/userData';

export const getUsers = async () => {
    let sortBy = 'ALPHABETIC'
    try {
        const res = await axios.get(api + '/v1/accounts', { params: { sortBy }, ...getAxiosConfig()});
        return res?.data.data as UserData[];
    } catch {
        throw new Error('Failed to fetch users');
    }
}