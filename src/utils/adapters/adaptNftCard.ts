import type { TokenData } from 'src/interfaces/tokenData';

export function adaptNftCard(data: TokenData) {
	return {
		imageUrl: data.metadata?.image,
		name: data.metadata?.name,
		collectionName: data.name,
		likes: 0,
		price: parseFloat(data.metadata?.price),
		tokenUri: data.token_uri
	};
}
