<script lang="ts">
	import { addUserRole } from '$utils/api/addUserRole';

	import {
		postVerificationQueueAdd,
		postInactivationQueueAdd
	} from '$utils/api/admin/userManagement';
	import { setPopup } from '$utils/popup';

	import { httpErrorHandler, notifyError, notifySuccess } from '$utils/toast';
	import type { UserData, UserRole } from 'src/interfaces/userData';
	import { createEventDispatcher } from 'svelte';
	import ConfirmBatchProcessPopup from '../admin/ConfirmBatchProcessPopup.svelte';
	import Dropdown from '../Dropdown.svelte';

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

	$: userStatus = profileData?.status;

	$: promoteDisabled =
		['VERIFIED', 'AWAITING_PROMOTED', 'AWAITING_INACTIVATED'].includes(userStatus) ||
		isChangingverifiedStatus ||
		!profileData;
	$: inactivateDisabled =
		['USER', 'AWAITING_PROMOTED', 'AWAITING_INACTIVATED'].includes(userStatus) ||
		isChangingverifiedStatus ||
		!profileData;

	// User roles
	const availableUserRoles = [
		{ label: 'Admin', value: 'admin' },
		{ label: 'User', value: 'user' }
	];

	let selectedRole: { label: string; value: UserRole };

	async function addRoleClick() {
		const added = await addUserRole(profileData.address, selectedRole.value);
		added ? notifySuccess('Role added!') : notifyError('Error adding role!');
		requestDataUpdate();
	}
</script>

<div class="px-32 py-24 gap-x-2 items-center">
	<div class="bg-gray-50 px-8 py-6 rounded-xl border">
		<div class="uppercase font-semibold text-lg">Admin tools</div>

		<hr class="border-px mt-4" />

		<!-- Verified creator promoting and inactivating -->
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

		<hr class="border-px mt-4" />

		<!-- User role selection -->
		<div class="font-semibold uppercase mt-6">
			User roles: <span class="gradient-text">{profileData?.roles}</span>
		</div>

		<div class="mt-2 font-semibold">Add a role:</div>
		<div class="w-72 flex mt-2">
			<Dropdown options={availableUserRoles} bind:selected={selectedRole} class="flex-grow" />
			<button class="btn btn-gradient aspect-1 rounded w-12 h-12 ml-2" on:click={addRoleClick}>
				+
			</button>
		</div>
	</div>
</div>
