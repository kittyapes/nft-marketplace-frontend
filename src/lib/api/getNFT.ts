export interface NftListing {
	id: string;
	name: string;
	image: string;
	artist: string;
	price: string;
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
				price: data.price
			};
		});
}
