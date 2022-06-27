import type { Listing } from "$utils/api/listing";
import type { UserData } from "../userData";

export interface SearchResults {
    collections: {
        data: any[],
        index: number,
        reachedEnd: boolean
    };
    users: {
        data: UserData[],
        index: number
        reachedEnd: boolean
    };
    listings: {
        data: any[],
        index: number
        reachedEnd: boolean
    };
}