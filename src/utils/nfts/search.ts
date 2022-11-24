import type { CardOptions } from '$interfaces/ui';

const alwaysTrue = () => true;

const createNftFilter = <T extends CardOptions>(search: string): ((nft: T) => boolean) => {
	const lowerSearchParts = search
		.toLowerCase()
		.split(/\s+/)
		.filter((_search) => _search.length > 0);

	if (lowerSearchParts.length === 0) return alwaysTrue;
	const matchesSearch = (search: string): boolean => {
		const _search = search
			.toLowerCase()
			.split(/\s+/)
			.filter((_search) => _search.length > 0);

		return lowerSearchParts.every((p) => p.length === 0 || _search.some((sp) => sp.startsWith(p) || sp.endsWith(p)));
	};
	const matchTrait = (array: any): boolean => {
		if (array?.length === 0) return false;
		for (let i = 0; i < array?.length; i++) {
			const match = matchesSearch(array[i].value.toLocaleUpperCase());
			if (match) return match;
		}
	};
	return ({ nfts }: T): boolean => Boolean(matchesSearch(nfts?.[0]?.name.toLocaleUpperCase()) || matchTrait(nfts[0]?.metadata?.traits));
};

export function filterNfts<T extends CardOptions>(nfts: T[], search: string): T[] {
	return nfts.filter(createNftFilter(search));
}
