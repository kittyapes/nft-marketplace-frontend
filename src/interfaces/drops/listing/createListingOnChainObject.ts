export interface CreateListingOnChainObject {
	dropId: number;
	startingPrice: number;
	endingPrice: number;
	duration: number; // in seconds
	payToken: string; // address
	quantity: number; // default is 1 - for inventoried drop pass > 1
	listingType: SELLING_TYPE;
}
