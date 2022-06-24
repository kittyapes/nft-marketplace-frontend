import { getAxiosConfig } from "$utils/auth/axiosConfig";
import { notifyError } from "$utils/toast";
import axios from "axios";
import { getApiUrl } from "..";

export const whitelistCollection = async (address: string) => {
    console.log({...getAxiosConfig()})
    try {
        const res = await axios.post(getApiUrl('latest', 'collections/crawl-collection'), { address }, getAxiosConfig());
        return res.data.data;
    } catch {
        notifyError('Failed to whitelist collection');
        throw new Error('Failed to whitelist collection');
    } 
}