<script lang="ts">
	import { postVerificationQueueAdd, postInactivationQueueAdd } from '$utils/api/admin/userManagement';
	import { setPopup } from '$utils/popup';

	import { httpErrorHandler, notifySuccess } from '$utils/toast';
	import type { UserData } from 'src/interfaces/userData';
	import { createEventDispatcher } from 'svelte';
	import ConfirmBatchProcessPopup from '../admin/ConfirmBatchProcessPopup.svelte';
	import PrimaryButton from '../v2/PrimaryButton/PrimaryButton.svelte';

	export let profileData: UserData;

	const dispatch = createEventDispatcher();

	function requestDataUpdate() {
		dispatch('requestDataUpdate');
	}

	let isChangingverifiedStatus = false;

	async function onProfilePromote() {
		isChangingverifiedStatus = true;

		const res = await postVerificationQueueAdd(profileData.address)
			.then((res) => {
				notifySuccess('Profile added to batch process queue.');
				return res;
			})
			.catch(httpErrorHandler);

		if (res) {
			setPopup(ConfirmBatchProcessPopup);
		}

		isChangingverifiedStatus = false;

		requestDataUpdate();
	}

	async function onProfileInactivate() {
		isChangingverifiedStatus = true;

		const res = await postInactivationQueueAdd(profileData.address)
			.then((res) => {
				notifySuccess('Profile added to batch inactivate queue.');
				return res;
			})
			.catch(httpErrorHandler);

		if (res) {
			setPopup(ConfirmBatchProcessPopup);
		}

		isChangingverifiedStatus = false;

		requestDataUpdate();
	}

	$: isVerifiedUser = profileData?.roles?.includes('verified_user');
	$: isInactivatedUser = profileData?.roles?.includes('inactivated_user');

	$: promoteDisabled = isVerifiedUser || isChangingverifiedStatus || !profileData;
	$: inactivateDisabled = !isVerifiedUser || isChangingverifiedStatus || !profileData;
</script>

<div class="items-center py-24 gap-x-2 ">
	<div class="px-8 py-6 border bg-dark-gradient text-white">
		<div class="text-lg font-semibold uppercase">Admin tools</div>

		<hr class="mt-4 border-px" />

		<!-- Verified creator promoting and inactivating -->
		<div class="mt-6 font-semibold uppercase">
			Verified creator status: <span class="text-gradient">
				{#if isVerifiedUser}
					Verified
				{:else if isInactivatedUser}
					Inactivated
				{:else}
					User
				{/if}
			</span>
		</div>

		<div class="flex items-center gap-4 mt-4 justify-evenly w-1/2">
			<PrimaryButton on:click={onProfilePromote} extButtonClass="w-1/2" disabled={promoteDisabled}>Promote</PrimaryButton>

			<PrimaryButton on:click={onProfileInactivate} variant="red" extButtonClass="w-1/2" disabled={inactivateDisabled}>Inactivate</PrimaryButton>
		</div>
	</div>
</div>
