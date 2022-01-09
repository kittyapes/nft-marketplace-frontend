import { currentUserAddress } from '$stores/wallet';
import { fetchProfileData, type ProfileData } from '$utils/api/profile';
import { get, writable } from 'svelte/store';

export const profileData = writable<ProfileData>(null);

currentUserAddress.subscribe(address => {
	address && refreshProfileData()
})

export async function refreshProfileData() {
	const newProfileData = await fetchProfileData(get(currentUserAddress));
	profileData.set(newProfileData);
}