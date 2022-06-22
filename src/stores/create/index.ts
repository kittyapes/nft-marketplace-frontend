import type { NftDraft } from '$interfaces/nft/nftDraft';
import { writable } from 'svelte/store';

export const nftDraft = writable<Partial<NftDraft>>({});
