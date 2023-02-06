export interface ConfigurableListingProps {
	price: string;
	quantity: number;

	// Seconds since epoch
	startDateTs: number;
	durationSeconds: number;
	startingPrice: string;
	reservePrice: string;
}
