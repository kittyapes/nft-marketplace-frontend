import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import type { UserData } from 'src/interfaces/userData';
import { getApiUrl } from '..';
import type { Collection } from '../collection';
import type { Listing } from '../listing';


export const getListingsByTitle = async (query: string, limit?: number) => {
    try {
        let params = {
            //query: query ? query.toString(): undefined,
            limit: limit ? limit : undefined,
        }
        const res = await axios.get(getApiUrl('latest', 'listings'), {params});
        return res.data.data as Listing[];
    } catch {    
        throw new Error('Failed to search for listings');
    }
}

export const getUsersByName = async (query: string, limit?: number) => {
    try {
        let params = {
            query: query ? query.toString() : undefined,
            limit: limit ? limit : undefined,
        }
        // should be without permissions
        const res = await axios.get(getApiUrl('latest', 'admins/users'),  { params , ...getAxiosConfig()});
        return res.data.data as UserData[];
    } catch {
        throw new Error('Failed to search for users');
    }
}

export const getCollectionsByTitle = async (query: string, limit?: number) => {
    try {
        let params = {
            query: query ? query.toString() : undefined,
            limit: limit ? limit : undefined,
        }
        const res = await axios.get(getApiUrl('latest', 'collections/search'),  { params , ...getAxiosConfig()});
        return res.data.data as Collection[];
    } catch {    
        throw new Error('Failed to search for collections');
    }
}