import type { ApiNftData } from '$interfaces/apiNftData';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import type { UserData } from 'src/interfaces/userData';
import { getApiUrl } from '..';
import type { Collection } from '../collection';
import type { Listing } from '../listing';


export const getNftsByTitle = async (query: string, limit?: number, page?: number) => {
    try {
        let params = {
            query: query ? query: undefined,
            page: page ? page : 1,
            limit: limit ? limit : undefined,
        }

        const res = await axios.get(getApiUrl('latest', 'nfts/search'), { params });
        
        return res.data.data as ApiNftData[];
    } catch {    
        throw new Error('Failed to search for listings');
    }
}

export const searchUsersByName = async (query: string, limit?: number, page?: number) => {
    try {
        let params = {
            username: query ? query : undefined,
            limit: limit ? limit : undefined,
            page: page ? page : 1,
        }

        if (params.username !== '' || params.username !== undefined || params.username.length < 3) {
            const res = await axios.get(getApiUrl('latest', 'users/search'),  { params });
            return res.data.data as UserData[];
        } else {
            return [];
        }

       
    } catch {
        throw new Error('Failed to search for users');
    }
}

export const getCollectionsByTitle = async (query: string, limit?: number, page?: number) => {
    try {
        let params = {
            name: query ? query : undefined,
            limit: limit ? limit : undefined,
            page: page ? page : 1,
        }

        const res = await axios.get(getApiUrl('latest', 'collections/search'),  { params });
        
        return res.data.data;
    } catch {    
        throw new Error('Failed to search for collections');
    }
}