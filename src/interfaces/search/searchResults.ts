import type { Listing } from "$utils/api/listing";
import type { UserData } from "../userData";

export interface SearchResults {
    collections: any[];
    users: UserData[];
    listings: Listing[];
}