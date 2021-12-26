import { ethers } from 'ethers';
import axios from 'axios';
import { request } from 'graphql-request';
import { GET_SINGLE_CARD } from '../../../graphql/marketplace';
import { CARD_STATUSES } from '$constants/marketplace';

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
	status: string;
}

export async function fetchAllMetadata(_cards: Array<Object>): Promise<NftListing> {
	return Promise.all(
		_cards.cards.map(async (card) => {
			let uri = card?.uri?.replace('radiant-falls-54169', 'databasewaifu');
			let amount = ethers.utils.formatEther(card?.amount);

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
				artist,
				// TODO: remove later
				status: CARD_STATUSES[Math.floor(Math.random() * CARD_STATUSES.length)]['status']
			};
		})
	).then((data) => {
		return data;
	});
}

export async function fetchMetadataFromUri(tokenId: number, uri: string): Promise<NftListing> {
	let cardResponse = await request(
		'https://api.thegraph.com/subgraphs/name/hysmagus/waifu',
		GET_SINGLE_CARD,
		{
			id: `0x${tokenId.toString(16)}`
		}
	);

	const card = await cardResponse.card;

	let amount = ethers.utils.formatEther(card?.amount || 0);

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
}
