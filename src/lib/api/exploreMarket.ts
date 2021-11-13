export interface NftListing {
	title: string;
	collection: string;
	img: string;
	likeCount: number;
	price: number;
}

export async function fetchNfts(): Promise<NftListing[]> {
	return Array(20)
		.fill(0)
		.map((_, i) => ({
			img: `https://picsum.photos/2${i + 30}/200`,
			title: 'Chillmeleon #3,806',
			collection: 'Bored Ape Yacht Club',
			likeCount: i + 100,
			price: 3.2
		}));
}
