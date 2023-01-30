import axios from 'axios';
import { getApiUrl } from '..';

export const getNftsByTitle = async (query: string, limit?: number, page?: number) => {
	try {
		const params = {
			query: query ? query : undefined,
			page: page ? page : 1,
			limit: limit ? limit : undefined,
		};

		const res = await axios.get(getApiUrl('latest', 'search/nfts'), { params });

		return res.data.data;
	} catch {
		throw new Error('Failed to search for listings');
	}
};

export const searchUsersByName = async (query: string, limit?: number, page?: number) => {
	try {
		const params = {
			query: query ? query : undefined,
			limit: limit ? limit : undefined,
			page: page ? page : 1,
		};

		if (params.query !== '' || params.query !== undefined || params.query.length < 3) {
			const res = await axios.get(getApiUrl('latest', 'search/users'), { params });
			return res.data.data;
		} else {
			return { totalCount: 0, users: [] };
		}
	} catch {
		throw new Error('Failed to search for users');
	}
};

export const getCollectionsByTitle = async (query: string, limit?: number, page?: number) => {
	try {
		const params = {
			query: query ? query : undefined,
			limit: limit ? limit : undefined,
			page: page ? page : 1,
		};

		const res = await axios.get(getApiUrl('latest', 'search/collections'), { params });

		return res.data.data;
	} catch {
		throw new Error('Failed to search for collections');
	}
};

export const globalSearch = async (query: string, limit?: number) => {
	try {
		const params = {
			query: query ? query : undefined,
			limit: limit ? limit : undefined,
		};

		const res = await axios.get(getApiUrl('latest', 'search'), { params });
		return res.data.data;
	} catch {
		throw new Error('Failed to search for collections');
	}
};

export const globalCollectionsSearch = async (query: string, limit?: number, page?: number) => {
	try {
		const params = {
			query: query ? query : undefined,
			limit: limit ? limit : undefined,
			page: page ? page : undefined,
		};

		const res = await axios.get(getApiUrl('latest', 'search/collections'), { params });
		return res.data.data;
	} catch {
		throw new Error('Failed to search for collections');
	}
};

export const globalUsersSearch = async (query: string, limit?: number, page?: number) => {
	try {
		const params = {
			query: query ? query : undefined,
			limit: limit ? limit : undefined,
			page: page ? page : undefined,
		};

		const res = await axios.get(getApiUrl('latest', 'search/users'), { params });
		return res.data.data;
	} catch {
		throw new Error('Failed to search for collections');
	}
};

export const globalNFTSearch = async (query: string, limit?: number, page?: number) => {
	try {
		const params = {
			query: query ? query : undefined,
			limit: limit ? limit : undefined,
			page: page ? page : undefined,
		};

		const res = await axios.get(getApiUrl('latest', 'search/nfts'), { params });
		return res.data.data;
	} catch {
		throw new Error('Failed to search for collections');
	}
};
