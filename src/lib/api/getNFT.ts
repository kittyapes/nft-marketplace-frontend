import { CARD_STATUSES } from '../../ts/constants/marketplace';
export interface NftListing {
	id: string;
	name: string;
	image: string;
	artist: string;
	price: string;
	supply: number;
	status: string;
}

export async function fetchNFTfromURI(uri: string): Promise<NftListing> {
	return fetch(uri)
		.then((response) => response.json())
		.then((data) => {
			return {
				id: data.id,
				name: data.name,
				image: data.image,
				artist: data.artist,
				// TODO: IMPORTANT: temporarily adding a random value as cost as a placeholder
				price: data.price || Math.abs(Math.floor(Math.random() * (10 - 1000 + 1) + 10)),
				supply: parseInt(data.supply),
				// TODO: IMPORTANT: Randomly adding a status for filters
				status: CARD_STATUSES[Math.floor(Math.random() * CARD_STATUSES.length)]
			};
		});
}
