import { api } from '$constants/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';

export const searchDropsByTitle = async (query: string) => {
    return await axios.get(api + '/v1/drops/search', {params: {keyword: query}} );
}