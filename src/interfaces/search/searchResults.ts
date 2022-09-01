import type { UserData } from "../userData";

export interface SearchResults {
    collections: {
        data: any[];
        index: number;
        reachedEnd: boolean;
        isLoading: boolean;
        fetchFunction: (query: string) => Promise<any> 
    };
    users: {
        data: UserData[];
        index: number;
        reachedEnd: boolean;
        isLoading: boolean;
        fetchFunction: (query: string) => Promise<any> 
    };
    nfts: {
        data: any[];
        isLoading: boolean;
        index: number;
        reachedEnd: boolean;
        fetchFunction: (query: string) => Promise<any> 
    };
}