import { currentUserAddress } from '$stores/wallet';
import { fetchProfileData, type ProfileData } from '$utils/api/profile';
import { derived } from 'svelte/store';

export const profileData = derived<any, ProfileData>(
	[currentUserAddress],
	([$currentUserAddress], set) => {
        if (!$currentUserAddress) return;

		fetchProfileData($currentUserAddress).then(set);
	}
);
