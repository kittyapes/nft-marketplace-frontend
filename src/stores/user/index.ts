import { currentUserAddress } from '$stores/wallet';
import { fetchProfileData } from '$utils/api/profile';
import type { UserData } from 'src/interfaces/userData';
import { derived, get, writable } from 'svelte/store';

export const profileData = writable<UserData>(null);

currentUserAddress.subscribe((address) => {
	address && refreshProfileData();
});

export async function refreshProfileData() {
	const newProfileData = await fetchProfileData(get(currentUserAddress));
	profileData.set(newProfileData);
}

export const profileCompletionProgress = derived(profileData, ($profileData) => {
	if (!$profileData) return null;

	return [$profileData?.email, $profileData?.bio, $profileData.thumbnailUrl, $profileData.coverUrl].filter((v) => !!v).length * 25;
});
