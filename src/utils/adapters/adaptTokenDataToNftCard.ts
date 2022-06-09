import type { TokenData } from 'src/interfaces/tokenData';
import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
import type { CardPopupOptions } from '$interfaces/cardPopupOptions';

export async function adaptTokenDataToNftCard(data: TokenData) {
	const popupOptions: CardPopupOptions = {
		id: data.token_id,
		title: data.metadata?.name + '#' + 0,
		assetUrl: data.metadata?.image
	};

	const nftCardOptions = {
		id: data.token_id,
		tokenId: data.token_id,
		imageUrl: data.metadata?.image,
		animationUrl: data.metadata?.animation_url || data.metadata?.image,
		title: data.metadata?.name,
		collectionName: data.name,
		likes: 0,
		price: parseFloat(data.metadata?.price).toString(),
		tokenStandard: data.contract_type,
		popupComponent: CardPopup,
		popupOptions
		// getPopupProps: async () => ({
		// 	options: {
		// 		id: data.metadata?.id,
		// 		title: data.metadata?.name,
		// 		imageUrl: data.metadata?.image,
		// 		animationUrl: data.metadata?.animation_url || data.metadata?.image,
		// 		currentUserIsOwner: get(currentUserAddress) === data.owner_of,
		// 		description: data.metadata?.description,
		// 		creator: data.metadata?.artist,
		// 		edition: data.metadata?.id && data.metadata?.supply ? `${data.metadata.id} of ${data.metadata.supply}` : '',
		// 		editionType: data.metadata?.categories
		// 		//externalLink: data.metadata.external_link,
		// 	}
		// })
	};

	return nftCardOptions;
}
