export interface TopCollection {
	img: string;
	title: string;
}

export async function fetchTopCollections(): Promise<TopCollection[]> {
	return Array(20)
		.fill(0)
		.map((_, i) => ({ img: `https://picsum.photos/2${i + 10}/200`, title: 'Title' }));
}
