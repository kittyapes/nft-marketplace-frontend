import type { ListingType } from "$utils/api/listing";

export interface MarketplaceFilters {
    status?: Set<ListingType>, 
    price?: { priceMin: number, priceMax: number }, 
    collection?: {label: string, value: string, iconUrl: string}
    sortBy?: 'NEWEST' | 'OLDEST' | 'POPULAR' | 'END1MIN'
}