import { api } from '$constants/api';
import { getAxiosConfig } from '$utils/auth/axiosConfig';
import axios from 'axios';
import type { DropApiReturnValue } from 'src/interfaces/drops/dropApiReturnValue';
import type { UserData } from 'src/interfaces/userData';


export const getDropsByTitle = async (query: string) => {
    try {
        let params;
        if (!query) {
            params = {}
        } else {
            params = { keyword: query }
        }
        const res = await axios.get(api + '/v1/drops/search', { params });
        return res.data.data as DropApiReturnValue[];
    } catch {    
        throw new Error('Failed to search for drops');
    }
}

export const getUsersByName = async (query: string) => {
    try {
        let params;
        if (!query) {
            params = {}
        } else {
            params = {query}
        }
        
        const res = await axios.get(api + '/v1/accounts',  { params , ...getAxiosConfig()});
        return res.data.data as UserData[];
    } catch {
        throw new Error('Failed to search for users');
    }
}

export const getCollectionsByTitle = async (query: string) => {
    //TODO implement once an endpoint exists
    /*
    try {
        const res = await axios.get(api + '/v1/accounts',  { params: { query }, ...getAxiosConfig()});
        return res.data.data as UserData[];
    } catch {    
        throw new Error('Failed to search for collections');
    }*/
}