import type { TokenData } from 'src/interfaces/tokenData';
import type { NftCardOptions } from 'src/interfaces/nftCardOptions';
import { currentUserAddress } from '$stores/wallet';
import { get, writable } from 'svelte/store';
import NftDisplayPopup from '$lib/components/profile/NFTDisplayPopup.svelte';

export async function adaptTokenDataToNftCard(data: TokenData) {
	// TODO maybe need to fetch some data from data.tokenUri?

	//console.log(data);
	/*
	const createdNftData = writable<NftData>(null);
	// can't match any token data to any field on the database
	const [getNftError, nftDataRes] = await useTryAsync(() => getNft(data.token_id));
	

	if(getNftError?.response.status === 404) {
		createdNftData.set(await createMintedNFTOnAPI({
			amount: data.amount,
			nftId: data.token_id,
			tokenAddress: data.token_address,
			contractAddress: data.minter_address,
			tokenStandard: data.contract_type,
			//needs to be converted to blob
			image: data.metadata?.image,
			//needs to be converted to blob
			animation: data.metadata?.animation_url || data.metadata?.image,
			creator: data.metadata?.artist,
			description: data.metadata?.description,
			name: data.metadata?.name,
			// not sure how to get this
			chain: null,
		}));
	}*/
	
	return {
		//id: getNftError ? get(createdNftData).nftId : nftDataRes.nftId,
		id: data.token_id,
		tokenId: data.token_id,
		imageUrl: data.metadata?.image,
		animationUrl: data.metadata?.animation_url || data.metadata?.image,
		title: data.metadata?.name,
		collectionName: data.name,
		//likes: getNftError ? get(createdNftData).favoriteCount : nftDataRes.favoriteCount,
		likes: 0,
		price: parseFloat(data.metadata?.price).toString(),
		tokenStandard: data.contract_type,
		popupComponent: NftDisplayPopup,
		getPopupProps: async () => {
			return {
				options: {
					id: data.metadata?.id,
					title: data.metadata?.name,
					imageUrl: data.metadata?.image,
					animationUrl: data.metadata?.animation_url || data.metadata?.image,
					currentUserIsOwner: get(currentUserAddress) === data.owner_of,
					description: data.metadata?.description,
					creator: data.metadata?.artist,
					edition: data.metadata?.id && data.metadata?.supply ? `${data.metadata.id} of ${data.metadata.supply}` : '',
					editionType: data.metadata?.categories
					//externalLink: data.metadata.external_link,
				}
			};
		}
		// tokenUri: data.token_uri
	} as unknown as NftCardOptions;
}
