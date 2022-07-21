import type { CardOptions } from '$interfaces/ui';

export function totalColRoyalties(options: Partial<CardOptions>) {
	return options.nfts[0].collectionData?.royalties?.reduce((acum, value) => acum + Number(value.fees ?? 0), 0);
}
