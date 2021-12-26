<script lang="ts">
	import { inactivateProfile, ProfileData, promoteProfile } from '$utils/api/profile';
	import { notifyError } from '$utils/toast';

	export let profileData: ProfileData;

	async function onProfilePromote() {
		try {
			await promoteProfile(profileData.address);
		} catch (e) {
			notifyError(e.message);
			return;
		}

		window.location.reload();
	}

	async function onProfileInactivate() {
		try {
			await inactivateProfile(profileData.address);
		} catch (e) {
			notifyError(e.message);
			return;
		}

		window.location.reload();
	}

	$: userStatus = profileData?.status;
</script>

<div class="px-32 py-24 flex gap-x-2 items-center">
	{#if userStatus === 'USER' || userStatus === 'AWAITING_INACTIVATED'}
		<button
			on:click={onProfilePromote}
			class="uppercase font-medium shadow px-4 py-2 rounded-full bg-gradient-to-r from-color-purple to-color-blue text-white transition-btn"
		>
			Promote
		</button>
	{:else}
		<button
			on:click={onProfileInactivate}
			class="uppercase font-medium shadow px-4 py-2 rounded-full transition-btn text-gray-600"
		>
			Inactivate
		</button>
	{/if}

	<div class="font-semibold ml-4 opacity-60">
		<span>Status:</span>
		<span>{profileData?.status}</span>
	</div>
</div>
