export interface FeaturedArtist {
	title: string;
	description: string;
	coverImg: string;
	profileImg: string;
}

export async function fetchFeaturedArtists(): Promise<FeaturedArtist[]> {
	return Array(20)
		.fill(0)
		.map((_, i) => ({
			coverImg: `https://picsum.photos/2${i + 20}/200`,
			profileImg: `https://picsum.photos/${i + 80}/${i + 80}`,
			title: '@mifun',
			description:
				'Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor hitapa mann cupati...'
		}));
}
