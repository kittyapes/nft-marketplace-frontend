export async function fetchCreatedNfts(): Promise<NftData[]> {
	return Array(20)
		.fill(0)
		.map((_, i) => ({
			img: `https://picsum.photos/2${i + 30}/200`,
			name: 'Chillmeleon #3,806',
			collectionName: 'Bored Ape Yacht Club',
			likes: i + 100,
			priceEth: 3.2,
			ownedByUser: true
		}));
}
