import type { TokenData } from 'src/interfaces/tokenData';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import { currentUserAddress } from '$stores/wallet';
import { get } from 'svelte/store';
import NftDisplayPopup from '$lib/components/profile/NFTDisplayPopup.svelte';

export function adaptTokenDataToNftCard(data: TokenData) {
	// TODO maybe need to fetch some data from data.tokenUri?

	console.log(data);

	return {
		id: data.token_id,
		imageUrl: data.metadata?.image,
		title: data.metadata?.name,
		collectionName: data.name,
		likes: 0,
		price: parseFloat(data.metadata?.price).toString(),
		popupComponent: NftDisplayPopup,
		getPopupProps: async () => {
			return {
				options: {
					id: data.metadata.id,
					title: data.metadata.name,
					imageUrl: data.metadata.image,
					animationUrl: data.metadata.animation_url || data.metadata.image,
					currentUserIsOwner: get(currentUserAddress) === data.owner_of,
					description: data.metadata.description,
					creator: data.metadata.artist,
					edition: data.metadata.id && data.metadata.supply ? `${data.metadata.id} of ${data.metadata.supply}` : '',
					editionType: data.metadata.categories
					//externalLink: data.metadata.external_link,
				}
			};
		}
		// tokenUri: data.token_uri
	} as NftCardOptions;
}
