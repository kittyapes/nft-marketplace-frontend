<script lang="ts">
	import { inactivateProfileNow, promoteProfileNow } from '$utils/api/admin/userManagement';

	import { httpErrorHandler, makeSuccessHandler, notifyError } from '$utils/toast';
	import { createEventDispatcher } from 'svelte';

	export let profileData: { address: string; status: string };

	const dispatch = createEventDispatcher();

	function requestDataUpdate() {
		dispatch('requestDataUpdate');
	}

	let isChangingverifiedStatus = false;

	async function onProfilePromote() {
		isChangingverifiedStatus = true;

		await promoteProfileNow(profileData.address)
			.then(makeSuccessHandler('Promoted profile.'))
			.catch(httpErrorHandler);

		isChangingverifiedStatus = false;

		requestDataUpdate();
	}

	async function onProfileInactivate() {
		isChangingverifiedStatus = true;

		await inactivateProfileNow(profileData.address)
			.then(makeSuccessHandler('Promoted profile.'))
			.catch(httpErrorHandler);

		isChangingverifiedStatus = false;

		requestDataUpdate();
	}

	$: userStatus = profileData?.status;

	$: promoteDisabled = userStatus === 'VERIFIED' || isChangingverifiedStatus;
	$: inactivateDisabled =
		userStatus === 'USER' || userStatus === 'INACTIVATED' || isChangingverifiedStatus;
</script>

<div class="px-32 py-24 gap-x-2 items-center">
	<div class="bg-gray-50 px-8 py-6 rounded-xl border">
		<div class="uppercase font-semibold text-lg">Admin tools</div>

		<hr class="separator mt-2" />

		<div class="font-semibold uppercase mt-4">
			Verified creator status: <span class="gradient-text">{profileData?.status}</span>
		</div>

		<div class="flex items-center gap-4 mt-4">
			<button on:click={onProfilePromote} class="btn-primary" disabled={promoteDisabled}>
				Promote
			</button>

			<button on:click={onProfileInactivate} class="btn-secondary" disabled={inactivateDisabled}>
				Inactivate
			</button>
		</div>
	</div>
</div>
