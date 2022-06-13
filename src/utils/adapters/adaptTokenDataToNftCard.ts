import type { TokenData } from 'src/interfaces/tokenData';
import CardPopup from '$lib/components/CardPopup/CardPopup.svelte';
import type { CardPopupOptions } from '$interfaces/cardPopupOptions';

export async function adaptTokenDataToNftCard(data: TokenData) {
	const popupOptions: CardPopupOptions = {
		id: data.token_id,
		title: data.metadata?.name,
		assetUrl: data.metadata?.image,
		favorited: false,
		resourceType: 'nft',
		nftData: [
			{
				metadata: data.metadata,
				isInternalNft: false,
				contractType: data.contract_type as any,
				creator: data.minter_address,
				contractAddress: data.token_address // Yes, this is really the contract_address. That's how Moralis returns it.
			}
		],
		rawResourceData: data
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
	};

	return nftCardOptions;
}
