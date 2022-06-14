import type { NftData } from '$interfaces/nft';
import NftDisplayPopup from '$lib/components/profile/NFTDisplayPopup.svelte';
import { currentUserAddress } from '$stores/wallet';
import { fetchProfileData } from '$utils/api/profile';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import { get } from 'svelte/store';
import type { UserData } from '$interfaces/userData';

export async function adaptNftDataNftCard(nft: NftData) {
	const creator: UserData = await fetchProfileData(nft.creator)
	const options: NftCardOptions = {
		id: nft.nftId,
		title: nft.name,
		imageUrl: nft.thumbnailUrl || nft.metadata?.image,
		animationUrl: nft.assetUrl || nft.metadata?.animation_url || nft.metadata?.image,
		likes: nft.favoriteCount,
		popupComponent: NftDisplayPopup,
		getPopupProps: async () => { 
			return {
				options: {
					id: nft.nftId,
					title: nft.name,
					imageUrl: nft.thumbnailUrl || nft.metadata?.image,
					animationUrl: nft.assetUrl || nft.metadata?.animation_url || nft.metadata?.image,
					currentUserIsOwner: get(currentUserAddress) === (nft.owner || nft.owner_of),
					description: nft.metadata?.description,
					creator: creator?.username || nft.metadata?.artist || 'No username',
					creatorImageUrl: creator?.thumbnailUrl || ''
			}}},
	};
	
	return options;
}