interface CreateListingServerObject {
	dropId: number;
	type: 'UNIQUE_FIXED_PRICE';
	price: string;
	creator: string;
}

interface DropListingApiReturnValue {}

interface CreateListingOnChainObject {
	dropId: number;
	startingPrice: number;
	endingPrice: number;
	duration: number; // in seconds
	payToken: string; // address
	quantity: number; // default is 1 - for inventoried drop pass > 1
	listingType: SELLING_TYPE;
}

enum SELLING_TYPE {
	FIXED_PRICE,
	INVENTORIED_FIXED_PRICE,
	TIME_LIMITED_WINER_TAKE_ALL_AUCTION,
	TIERED_1_OF_N_AUCTION,
	TIME_LIMITED_PRICE_PER_TICKET_RAFFLE,
	TIME_LIMITED_1_OF_N_WINNING_TICKETS_RAFFLE
}
