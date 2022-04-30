import type { TokenData } from 'src/interfaces/tokenData';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import { currentUserAddress } from '$stores/wallet';
import { get } from 'svelte/store';

export function adaptTokenDataToNftCard(data: TokenData) {
	// TODO maybe need to fetch some data from data.tokenUri?

	return {
		imageUrl: data.metadata?.image,
		title: data.metadata?.name,
		collectionName: data.name,
		likes: 0,
		price: parseFloat(data.metadata?.price).toString(),
		getUniversalPopupOptions: async () => {
			return {
				id: data.metadata.id,
				title: data.metadata.name,
				imageUrl: data.metadata.image,
				animationUrl: data.metadata.animation_url,
				currentUserIsOwner: get(currentUserAddress) === data.owner_of,
				description: data.metadata.description,
				creator: data.metadata.artist,
				edition: data.metadata.id && data.metadata.supply ? `${data.metadata.id} of ${data.metadata.supply}` : '',
				editionType: data.metadata.categories
				//externalLink: data.metadata.external_link,
			};
		}
		// tokenUri: data.token_uri
	} as NftCardOptions;
}
