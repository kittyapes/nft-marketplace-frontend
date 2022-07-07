import type { ApiNftData } from '$interfaces/apiNftData';
import { currentUserAddress } from '$stores/wallet';
import { fetchProfileData } from '$utils/api/profile';
import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
import type { UserData } from 'src/interfaces/userData';
import { derived, get, writable } from 'svelte/store';

export const profileData = writable<UserData>(null);

currentUserAddress.subscribe((address) => {
	if (!address) return;
	
	refreshProfileData();
	refreshLikedNfts(address);
});

export async function refreshProfileData() {
	const newProfileData = await fetchProfileData(get(currentUserAddress));
	profileData.set(newProfileData);
}

export const profileCompletionProgress = derived(profileData, ($profileData) => {
	if (!$profileData) return null;

	return [$profileData?.email, $profileData?.bio, $profileData.thumbnailUrl, $profileData.coverUrl].filter((v) => !!v).length * 25;
});

export async function refreshLikedNfts(address: string) {
	const nfts = await getUserFavoriteNfts(address);
	userLikedNfts.set(nfts);
}

export const userLikedNfts = writable<{ nft: ApiNftData }[]>([]);

// for favoriting state between popup and card
export const likedNfts = writable<[string[], -1 | 1 | 0]>([[], 0]);
