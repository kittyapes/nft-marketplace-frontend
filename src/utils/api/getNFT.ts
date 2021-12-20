import { CARD_STATUSES } from '$constants/marketplace';
import { ethers } from 'ethers';
import axios from 'axios';

export interface NftListing {
	amount: string;
	animation_url: string;
	artist: string;
	batch: string;
	categories: string;
	categoryIndex: string;
	creationDate: string;
	generation: string;
	id: string;
	image: string;
	maxSupply: string;
	name: string;
	totalSupply: string;
	uri: string;
}

export async function fetchAllMetadata(_cards: Array<any>): Promise<NftListing> {
	return Promise.all(
		_cards.cards.map(async (card) => {
			let uri = card.uri.replace('radiant-falls-54169', 'databasewaifu');
			let amount = ethers.utils.formatEther(card.amount);

			const response: any = await axios.get(uri).catch((error) => console.log(error.message));

			if (response['headers']['content-length'] == '0') return;

			let { name, id, generation, image, animation_url, categories, categoryIndex, batch, artist } =
				response.data;

			return {
				...card,
				amount,
				uri,
				id,
				name,
				image,
				animation_url,
				generation,
				categories,
				categoryIndex,
				batch,
				artist
			};
		})
	).then((data) => {
		return data;
	});
}
