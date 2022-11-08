import type { ApiNftData } from '$interfaces/apiNftData';
import type { PublicProfileData } from '$interfaces/userData';
import { appDataToTriggerReload, currentUserAddress } from '$stores/wallet';
import { fetchCurrentUserData, fetchProfileData } from '$utils/api/profile';
import { isAuthTokenExpired } from '$utils/auth/token';
import { getUserFavoriteNfts } from '$utils/nfts/getUserFavoriteNfts';
import { derived, get, writable } from 'svelte/store';

export const profileData = writable<Awaited<ReturnType<typeof fetchCurrentUserData>>>(null);
export const publicProfileData = writable<PublicProfileData>(null);

appDataToTriggerReload.subscribe(() => {
	const address = get(currentUserAddress);
	if (!address) return;

	refreshPublicProfileData(address);

	if (!isAuthTokenExpired(address)) {
		refreshProfileData();
		refreshLikedNfts(address);
	}
});

async function refreshPublicProfileData(address?: string) {
	address = address || get(currentUserAddress);

	const data = await fetchProfileData(address);

	publicProfileData.set(data);
}

export async function refreshProfileData() {
	const newProfileData = await fetchCurrentUserData();

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
export const likedNftIds = derived(userLikedNfts, (userLiked) => userLiked.map((nft) => nft.nft.nftId));

export const userCreatedListing = writable<boolean>(false);

export const nftBalances = derived(profileData, (d) => d.nftBalances);

export function getTokenBalance(onChainId: string) {
	return get(nftBalances)?.[onChainId] || 0;
}
