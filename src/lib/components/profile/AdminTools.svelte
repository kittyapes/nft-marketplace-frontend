<script lang="ts">
	import {
		postVerificationQueueAdd,
		postInactivationQueueAdd
	} from '$utils/api/admin/userManagement';
	import { setPopup } from '$utils/popup';

	import { httpErrorHandler, notifySuccess } from '$utils/toast';
	import { createEventDispatcher } from 'svelte';
	import ConfirmBatchProcessPopup from '../admin/ConfirmBatchProcessPopup.svelte';

	export let profileData: { address: string; status: string };

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

	$: userStatus = profileData?.status;

	$: promoteDisabled =
		['VERIFIED', 'AWAITING_PROMOTED', 'AWAITING_INACTIVATED'].includes(userStatus) ||
		isChangingverifiedStatus ||
		!profileData;
	$: inactivateDisabled =
		['USER', 'AWAITING_PROMOTED', 'AWAITING_INACTIVATED'].includes(userStatus) ||
		isChangingverifiedStatus ||
		!profileData;
</script>

<div class="px-32 py-24 gap-x-2 items-center">
	<div class="bg-gray-50 px-8 py-6 rounded-xl border">
		<div class="uppercase font-semibold text-lg">Admin tools</div>

		<hr class="border-px mt-4" />

		<div class="font-semibold uppercase mt-6">
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
