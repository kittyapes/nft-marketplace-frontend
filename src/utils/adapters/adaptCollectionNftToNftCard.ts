import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import type { NftData } from 'src/interfaces/nft';
import { get } from 'svelte/store';
import { currentUserAddress } from '$stores/wallet';

export function adaptCollectionNftToNftCard(nftData: NftData) {
	const options: NftCardOptions = {
		id: nftData._id,
		title: nftData.name,
		imageUrl: nftData.thumbnailUrl,
		collectionName: 'N/A',
		likes: 0,
		price: nftData.price.toString(),
		getUniversalPopupOptions: async () => {
			return {
				id: nftData._id,
				title: nftData.name,
				currentUserIsOwner: nftData.owner === get(currentUserAddress),
				// animationUrl: nftData.assetUrl,
				imageUrl: nftData.assetUrl,
				creator: nftData.creator,
				description: nftData.metadata.description
			};
		}
	};

	return options;
}
